'''
Heavily borrowed from https://github.com/myracheng/markedpersonas
'''

import argparse
from collections import defaultdict, Counter
import math
import pandas as pd

def get_log_odds(df1, df2, df0, lower=True):
    if lower:
        counts1 = defaultdict(int,[[i,j] for i,j in df1.str.lower().str.split(expand=True).stack().replace('[^a-zA-Z\s]','',regex=True).value_counts().items()])
        counts2 = defaultdict(int,[[i,j] for i,j in df2.str.lower().str.split(expand=True).stack().replace('[^a-zA-Z\s]','',regex=True).value_counts().items()])
        prior = defaultdict(int,[[i,j] for i,j in df0.str.lower().str.split(expand=True).stack().replace('[^a-zA-Z\s]','',regex=True).value_counts().items()])
    else:
        counts1 = defaultdict(int,[[i,j] for i,j in df1.str.split(expand=True).stack().replace('[^a-zA-Z\s]','',regex=True).value_counts().items()])
        counts2 = defaultdict(int,[[i,j] for i,j in df2.str.split(expand=True).stack().replace('[^a-zA-Z\s]','',regex=True).value_counts().items()])
        prior = defaultdict(int,[[i,j] for i,j in df0.str.split(expand=True).stack().replace('[^a-zA-Z\s]','',regex=True).value_counts().items()])
    
    sigmasquared = defaultdict(float)
    sigma = defaultdict(float)
    delta = defaultdict(float)

    for word in prior.keys():
        prior[word] = int(prior[word] + 0.5)

    for word in counts2.keys():
        counts1[word] = int(counts1[word] + 0.5)
        if prior[word] == 0: prior[word] = 1

    for word in counts1.keys():
        counts2[word] = int(counts2[word] + 0.5)
        if prior[word] == 0: prior[word] = 1

    n1 = sum(counts1.values())
    n2 = sum(counts2.values())
    nprior = sum(prior.values())
    
    for word in prior.keys():
        if prior[word] > 0:
            l1 = float(counts1[word] + prior[word]) / (( n1 + nprior ) - (counts1[word] + prior[word]))
            l2 = float(counts2[word] + prior[word]) / (( n2 + nprior ) - (counts2[word] + prior[word]))
            sigmasquared[word] =  1 / (float(counts1[word]) + float(prior[word])) + 1 / (float(counts2[word]) + float(prior[word]))
            sigma[word] =  math.sqrt(sigmasquared[word])
            delta[word] = (math.log(l1) - math.log(l2)) / sigma[word]

    return delta

def marked_words(df, target_val, target_col, unmarked_val):
    grams = dict()
    thr = 1.96

    subdf = df.copy()
    for i in range(len(target_val)): subdf = subdf.loc[subdf[target_col[i]]==target_val[i]]

    for i in range(len(unmarked_val)):
        delt = get_log_odds(subdf['text'], df.loc[df[target_col[i]]==unmarked_val[i]]['text'],df['text'])
                
        c1 = []
        c2 = []
        for k,v in delt.items():
            if v > thr: c1.append([k,v])
            elif v < -thr: c2.append([k,v])

        if 'target' in grams: grams['target'].extend(c1)
        else: grams['target'] = c1
        
        if unmarked_val[i] in grams: grams[unmarked_val[i]].extend(c2)
        else: grams[unmarked_val[i]] = c2
        
    grams_refine = dict()

    for r in grams.keys():
        temp = []
        thr = len(unmarked_val)
        for k,v in Counter([word for word, z in grams[r]]).most_common():
            if v >= thr:
                z_score_sum = np.sum([z for word, z in grams[r] if word == k])
                temp.append([k, z_score_sum])

        grams_refine[r] = temp
    return grams_refine['target']

def main():
    parser = argparse.ArgumentParser()
    
    parser.add_argument('file')
    parser.add_arugment('--target-val', nargs='*', type=str, default=[])
    parser.add_argument('--target-col', nargs='*', type=str, default=[])
    parser.add_arugment('--unmarked-val', nargs='*', type=str, default=[])
    
    args = parser.parse_args()
    assert len(args.target_val) == len(args.target_val) == len(args.unmarked_val), 'Incoherent args'
    assert len(args.target_val) > 0, 'Must have multiple target values'
    
    df = pd.read_csv(args.file)
    print(marked_words(df, args.target_val, args.target_col, args.unmarked_val))