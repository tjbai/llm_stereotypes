'''
Heavily borrowed from https://github.com/myracheng/markedpersonas
'''

from dotenv import load_env
import argparse

def main():
    load_env()

    parser = argparse.ArgumentParser()
    parser.add_argument('N', type=int, default=10)
    parser.add_argument('MODEL', type=str, default='gpt-4')
    
    

if __name__ == '__main__':
    main()