import re

def is_new_section(line):
    # new sections start with something like: T0B - Antenna safety....
    if re.search(r"^[A-Z]\d[A-Z]\s", line):
        return True
    else:
        return False


def is_question_id(line):
    # Question IDs are in the form: T0B11 (A)
    # The (A) is the answer but we just search for the ID here
    if re.search(r"^\w\d\w\d{2}\s", line):
        return True
    else:
        return False

# each question is seperated by the token ~~


def is_question_divider(line):
    if re.search(r"^~~", line):
        return True
    else:
        return False