Amateur Radio License Exam Practice

## First Step

Download the question pools for each of the three exams: Technician, General and Amateur Extra.
The question pools have to be text format. You will have to convert and PDF files to text. There are
text files in ./data/raw that contain questions for each of the exams. If the question pools are
updated these files will have to also be updated.

Questions in the text file have to be in the format:

~~
G1A12 (C) [97.303]
Which of the following applies when the FCC rules designate the Amateur Service as a secondary user on a
band?
A. Amateur stations must record the call sign of the primary service station before operating on a frequency
assigned to that station
B. Amateur stations can use the band only during emergencies
C. Amateur stations can use the band only if they do not cause harmful interference to primary users
D. Amateur stations may only operate during specific hours of the day, while primary users are permitted 24-
hour use of the band
~~

They must be seperated by ~~ and each choice must be on a seperate line. The choices and question can span
multiple lines.

## Second Step

Run the Python script ./data_tools/txt_json_question.py on each of the text files. This will convert the
text version of the question pools into JSON. These JSON files are used to import the question data into
the Mongo Database.

## Third Step

Run the ./server/database_setup/add_questions.js file. This will actually add the questions to the Mongo
Database. The database must already be setup and running. This script also does no checking to see if
the items are already in the database so it is possible to add the same question multiple times.
