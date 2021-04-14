import sys
from utils import is_question_divider, is_question_id, is_new_section

def get_section_descriptions(data_file):
    # section descriptions look like:
    #
    # T1A - Amateur Radio Service: purpose and permissible use of the Amateur Radio Service, operator/primary station
    # license grant; Meanings of basic terms used in FCC rules; Interference; RACES rules; Phonetics; Frequency Coordinator
    #
    # They either end with a blank line or are followed by a question
    descriptions = []
    with open(data_file, encoding="utf-8") as question_file:

        for line in question_file:
            if is_new_section(line):
                # check for multiple lines
                next_line = question_file.readline()
                while not is_question_id(next_line) and not is_question_divider(next_line):
                    line += next_line
                    next_line = question_file.readline()
                descriptions.append(line.replace("\n", ""))

    return descriptions

if len(sys.argv) < 2:
    print("No data file provided")
    quit()
else:
    data_file = sys.argv[1]

sections = get_section_descriptions(data_file)

for section in sections:
    print(section)