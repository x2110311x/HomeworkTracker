# Majority of code modified from the following source
# https://www.youtube.com/watch?v=XQgXKtPSzUI&t=1613s&ab_channel=DataScienceDojo

from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import csv
import re

class_list = []
class_links = []
course_titles = []


def parse_class_list():
    page_soup = get_html_soup()

    get_classes(page_soup)

    write_all_lists_to_file()


def get_html_soup():
    url = 'http://catalog.kent.edu/coursesaz/'
    
    page_html = get_html(url)

    page_soup = soup(page_html, "html.parser")

    return page_soup


def get_html(url):
    uClient = uReq(url)
    page_html = uClient.read()
    uClient.close()
    return page_html


def get_classes(page_soup):
    class_list_html = page_soup.findAll("div", {"id": "atozindex"})[0].findAll("ul", {})

    retrieve_class_list(class_list_html)

    for class_link in class_links:
        course_soup = get_course_soup(class_link)
        

        for title in course_soup:
            retrieve_course_names(title)


def retrieve_class_list(list_html):
    for class_container in list_html:
        for class_name in class_container.findAll('li', {}):
            class_list.append(class_name.text)
            if(class_name.a['href'] != "/coursesaz/seeall/"):
                class_links.append("http://catalog.kent.edu" + class_name.a['href'])


def write_list_to_file(info_list, file):
    with open(file, 'w') as f:
        write = csv.writer(f, delimiter = '\n')
        write.writerow(info_list)


def get_course_soup(class_link):
    uClient = uReq(class_link)
    page_html = uClient.read()
    uClient.close()

    page_soup = soup(page_html, "html.parser")

    return page_soup.findAll("div", {"class": "sc_sccoursedescs"})[0].findAll("p", {"class": "courseblocktitle"})


def retrieve_course_names(title):
    course_code = re.findall("^[A-Z]{2,4}\s[0-9]{5}", title.text)[0]
    course_codelen = len(course_code)
    credit_hours = re.findall("(\\s+[0-9](\\-{0,1},{0,1}[0-9]{0,2}){0,1}\\sCredit\\sHour(s){0,1})$", title.text)[0][0]
    
    credit_hoursindex = title.text.find(credit_hours)
    course_title = title.text[course_codelen+6:credit_hoursindex]

    course_titles.append(f"{course_code},{course_title}")


def write_all_lists_to_file():
    write_list_to_file(class_list, "categories.csv")
    write_list_to_file(class_links, "class_links.csv")
    write_list_to_file(course_titles, "course_titles.csv")
    

parse_class_list()