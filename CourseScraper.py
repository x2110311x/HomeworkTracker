from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import csv

url = 'http://catalog.kent.edu/coursesaz/'

uClient = uReq(url)
page_html = uClient.read()
uClient.close()

page_soup = soup(page_html, "html.parser")

class_list_html = page_soup.findAll("div", {"id": "atozindex"})[0].findAll("ul", {})

class_list = []

class_links = []

for class_container in class_list_html:
    for class_name in class_container.findAll('li', {}):
        class_list.append(class_name.text)
        if(class_name.a['href'] != "/coursesaz/seeall/"):
            class_links.append("http://catalog.kent.edu" + class_name.a['href'])


with open("categories.csv", 'w') as f:
    write = csv.writer(f, delimiter = '\n')

    write.writerow(class_list)


with open("class_links.csv", 'w') as f:
    write = csv.writer(f, delimiter = '\n')

    write.writerow(class_links)

course_titles = []

for class_link in class_links:
    print(class_link)
    uClient = uReq(class_link)
    page_html = uClient.read()
    uClient.close()

    page_soup = soup(page_html, "html.parser")

    course_list_html = page_soup.findAll("div", {"class": "sc_sccoursedescs"})[0].findAll("p", {"class": "courseblocktitle"})

    for title in course_list_html:
        segments = title.text.split('\t')
        course_titles.append(','.join(segments[0:1]))




with open("course_titles.csv", 'w') as f:
    write = csv.writer(f, delimiter = '\n')

    write.writerow(course_titles)