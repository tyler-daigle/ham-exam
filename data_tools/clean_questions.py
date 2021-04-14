import re

data_file = "../data/ham_questions.txt"

with open(data_file, encoding="utf-8") as ham_questions:
    for line in ham_questions:
        if re.search(r"^\~\~\w\d\w\d{2}", line):
            print("{0}\n{1}".format(line[0:2], line[2:]))
        else:
            print(line, end="")
