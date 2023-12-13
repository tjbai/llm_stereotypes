import os
import base64
import requests
import dotenv
import pandas as pd
from tqdm import tqdm
from collections import defaultdict
from marked_words import marked_words

import firebase_admin
from firebase_admin import credentials, db

dotenv.load_dotenv()
STABILITY_KEY = os.getenv('STABILITY_KEY')
STABILITY_HOST = os.getenv('STABILITY_HOST')

cred = credentials.Certificate("./service_key.json")
firebase_admin.initialize_app(cred, {'databaseURL': 'https://marked-personas-default-rtdb.firebaseio.com'})

df = pd.read_csv('../data/personas_gpt-4_20.csv')

def init_marked_words():
    df = pd.read_csv('../data/personas_gpt-4_20.csv')
    words = dict()
    personas = dict()

    for race in ['asian', 'black', 'middle-eastern', 'latino', 'latina']:
        marked = marked_words(df, target_val=[race], target_col=['race'], unmarked_val=['white'])
        filtered = df[df['race'] == race]['text'].tolist()
        words[race] = marked
        personas[race] = filtered
        print(race, len(marked))
        print(race, len(filtered))

    for gender in ['woman', 'nonbinary person']:
        marked = marked_words(df, target_val=[gender], target_col=['gender'], unmarked_val=['man'])
        filtered = df[df['race'] == race]['text'].tolist()
        if gender == 'nonbinary person': gender = 'nonbinary'
        words[gender] = marked
        personas[gender] = filtered
        print(gender, len(marked))
        print(gender, len(filtered))
        
    for race in ['asian', 'black', 'middle-eastern', 'latino', 'latina']:
        for gender in ['woman', 'nonbinary person']:
            if race == 'latino' and gender == 'woman': continue
            if race == 'latina' and gender == 'nonbinary person': continue
            marked = marked_words(df, target_val=[gender, race], target_col=['gender', 'race'], unmarked_val=['white', 'man'])
            filtered = df[df['race'] == race]
            filtered = filtered[df['gender'] == gender]['text'].tolist()
            if gender == 'nonbinary person': gender = 'nonbinary'
            words[f'{race}_{gender}'] = marked 
            personas[f'{race}_{gender}'] = filtered
            print(race, gender, len(marked))
            print(race, gender, len(filtered))
            
    for k, v in words.items():
        word_ref = db.reference(f'{k}/words')
        word_ref.set(sorted(v, key=lambda x: x[1], reverse=True))

    for k, v in personas.items():
        persona_ref = db.reference(f'{k}/personas')
        persona_ref.set(v)
        
    return words, personas
        
def gen_images(race=None, gender=None, n=20):
    if race is None and gender is None: raise Exception("invalid args")
    elif race is None: key = gender
    elif gender is None: key = race
    else: key = f'{race}_{gender}'
    
    top_personas = db.reference(f'{key}/top_personas')
    personas = top_personas.get()
    if personas is None or len(personas) == 0: return
    inspos = [x[0] for x in personas[:n]] # get the 5 top weighted personas
    
    portraits = db.reference(f'{key}/portraits')
    for i, t in tqdm(enumerate(inspos)):
        response = requests.post(
            f'{STABILITY_HOST}/v1/generation/stable-diffusion-v1-6/text-to-image',
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': f'Bearer {STABILITY_KEY}'
            },
            json={'text_prompts': [{'text': t}]}
        )
        
        if response.status_code != 200:
            raise Exception('Encountered', response.status_code)
        
        payload = response.json()
        for image in payload['artifacts']:
            portraits.push(image['base64'])
            with open(f'../data/{key}_{i}.png', 'wb') as f:
                f.write(base64.b64decode(image['base64']))
                
def weight_personas():
    words, personas = init_marked_words()
    
    # weight personas by markedness
    for k, v in personas.items():
        weights = defaultdict(int)
        for word, weight in words[k]: weights[word] = weight
        personas_weights = []
        for _persona in v:
            persona = _persona.lower()
            markedness = sum(weights[word] for word in persona.split())
            personas_weights.append((persona, markedness))
        
        top_persona_ref = db.reference(f'{k}/top_personas')
        top_persona_ref.set(sorted(personas_weights, key=lambda x: x[1], reverse=True))
        
if __name__ == '__main__':
    for race in ['asian', 'black', 'middle-eastern', 'latino', 'latina']:
        print(f'generating for {race}')
        gen_images(race=race)
        
    # for gender in ['woman', 'nonbinary']:
    #     print(f'generating for {gender}')
    #     gen_images(gender=gender)
        
    # for race in ['asian', 'black', 'middle-eastern', 'latino', 'latina']:
    #     for gender in ['woman', 'nonbinary']:
    #         if race == 'latino' and gender == 'woman': continue
    #         if race == 'latina' and gender == 'nonbinary person': continue
    #         print(f'generating for {race} {gender}')
    #         gen_images(race=race, gender=gender)