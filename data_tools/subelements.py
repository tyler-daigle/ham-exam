import sys
import re
import json
from utils import is_new_section, is_question_id

# SubElement Object 
# {subelement_id, subelement_description, num_questions, num_groups}

def get_subelements(data_file):
    subelements = []

    with open(data_file, encoding="utf-8") as question_file:
        # we are looking for all lines that start with SUBELEMENT

        line = question_file.readline()
        while line:
            if re.search(r"^SUBELEMENT\s\w\d", line):
                # some SUBELEMENT lines might be more than one line long
                temp_file_pos = question_file.tell()
                next_line = question_file.readline()
                if not is_new_section(next_line) and not is_question_id(next_line) and next_line != "":
                    line += next_line
                else:
                    # put the line we just read back
                    question_file.seek(temp_file_pos)

                line = line.replace("\n", "")
                info = line[line.find("[") + 1:].split()
                num_questions = int(info[0])
                num_groups = int(info[-2])

                subelement = {
                    "subelement_id" : line[11:13], 
                    # "subelement_description" : line[16: line.find("[") - 3], 
                    "subelement_description" : line[16: line.find("[") - 1], 
                    "num_questions" : num_questions, 
                    "num_groups" : num_groups
                }

                subelements.append(subelement)
            line = question_file.readline()

        return subelements


if len(sys.argv) < 2:
    print("No data file provided")
    quit()
else:
    data_file = sys.argv[1]

subs = get_subelements(data_file)
print(json.dumps(subs))