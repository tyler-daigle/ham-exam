import re
import json
import sys
from utils import is_new_section, is_question_id, is_question_divider

def get_all_questions(data_file):
    questions = []
    # questions start with something like: T1A11 (B) [97.101 (d)]
    # and they end at the ~~ token
    with open(data_file, encoding="utf-8") as question_file:
        for line in question_file:
            if is_question_id(line):
                current_question = {"id": line, "question_data": []}

                # grab all the text and put each line into an array

                line = question_file.readline()
                while not is_question_divider(line) and line != "":
                    current_question["question_data"].append(line)
                    line = question_file.readline()
                questions.append(current_question)
    return questions


def clean_question(question):
    # take the question object returned from get_all_questions() and
    # convert it into a cleaner object of the form:

    ###################################################################
    #                   Format of the Question Dict
    # {id, answer, question_text, choices: {"A":"asdf", "B":"asdf"...}}
    ###################################################################

    q = {"choices": {}}

    # the id is always the first 5 characters of the id field
    q["id"] = question["id"][0:5]
    
    # if this function fails it is most likely because the text file has an error in it
    # each question should be on a seperate line - each choice must also be on a seperate 
    # line

    # print the id of the question - for debugging errors in the text files
    # ***********************************************************************
    # print(q["id"])
    # ***********************************************************************

    # index 7 is the correct answer
    q["answer"] = question["id"][7]

    # question text starts at the first index and goes until one of the elements
    # starts with "A."
    # question["question_data"] is an array of strings - each element is a line from
    # the questions.

    question_data = question["question_data"]  # just an alias to the array
    question_text = question_data[0]
    data_index = 1
    choice_text = ""

    # get the actual question
    # keep checking the array elements until one of them starts with A.
    while question_data[data_index][:2] != "A.":
        question_text += question_data[data_index]
        data_index += 1

    # at this point data_index should be the index of the first choice A

    choice_chars = ["A.", "B.", "C.", "D."]
    next_char = 1
    curr_char = 0

    # if we don't find a line starting something like "B." then we assume that the
    # current choice is spanning more than one line.
    while next_char < len(choice_chars):
        # print(question_data[data_index])
        while question_data[data_index][:2] != choice_chars[next_char]:
            choice_text += question_data[data_index]
            data_index += 1
        q["choices"][choice_chars[curr_char][0]] = choice_text
        choice_text = ""
        next_char += 1
        curr_char += 1

    # Choices A, B and C will be in the dictionary. The last remaining elements in the question["question_data"]
    # array will be the final question
    choice_text = ""
    while data_index < len(question_data):
        choice_text += question_data[data_index]
        data_index += 1

    q["choices"]["D"] = choice_text

    q["question_text"] = question_text.replace("\n", "")
    # strip out the newlines from the text and replace with spaces. Also remove the Choice character from
    # the start of the choices
    for char, choice in q["choices"].items():
        q["choices"][char] = choice[3:].replace("\n",  "")

    return q


def display_question(question):
    print("ID: {0}".format(question["id"]))
    print("Answer: {0}".format(question["answer"]))
    print("Question: {0}".format(question["question_text"]))

    for char, choice in question["choices"].items():
        print("{0}: {1}".format(char, choice))


def group_questions(questions):
    # group all the questions by the ids
    # the ID is the first 3 characters in the question id
    question_groups = {}

    for question in questions:
        id_str = question["id"][:3]

        if not id_str in question_groups:
            question_groups[id_str] = []
        question_groups[id_str].append(question)

    return question_groups


def questions_to_json(data_file):

    # load all the questions from the text file
    unclean_questions = get_all_questions(data_file)
    cleaned_questions = []

    for question in unclean_questions:
        cleaned_questions.append(clean_question(question))
  
    return json.dumps(cleaned_questions)


if len(sys.argv) < 2:
    print("No data file provided")
else:
    data_file = sys.argv[1]
# data_file = "../data/tech_questions.txt"
try:
    json_data = questions_to_json(data_file)
except OSError:
    print("{0} not found.".format(data_file))
    exit()
print(json_data)
