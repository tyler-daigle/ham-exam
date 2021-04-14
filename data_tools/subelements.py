import sys
import re
from utils import is_new_section, is_question_id

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

                subelements.append(line.replace("\n", ""))
            line = question_file.readline()

        return subelements


if len(sys.argv) < 2:
    print("No data file provided")
    quit()
else:
    data_file = sys.argv[1]

print(get_subelements(data_file))