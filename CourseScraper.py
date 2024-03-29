# Majority of code modified from the following source
# https://www.youtube.com/watch?v=XQgXKtPSzUI&t=1613s&ab_channel=DataScienceDojo

from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import csv
import re
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

class_list = []
course_categories = []
class_links = []
course_titles = []
course_dicts = []
global fs_client


def parse_class_list():
    page_soup = get_html_soup()

    get_classes(page_soup)
    print("Retrieved courses")

    #write_all_lists_to_file()

    fs_client = initialize_firestore_Connection()
    create_category_documents(fs_client)
    print("Course Categories created")
    create_tag_documents(fs_client)
    print("Courses added")


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
        category = get_course_category(class_link)
        course_categories.append(category)
        
        for title in course_soup:
            retrieve_course_names(category, title)


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

def get_course_category(class_link):
    uClient = uReq(class_link)
    page_html = uClient.read()
    uClient.close()

    page_soup = soup(page_html, "html.parser")
    categoryTitle, categoryCode = page_soup.findAll("h1", {"class": "page-title"})[0].text.split("(")
    categoryCode = categoryCode.replace(")", "")
    categoryTitle = categoryTitle[:len(categoryTitle)-1]
    return (categoryTitle, categoryCode)

def get_course_soup(class_link):
    uClient = uReq(class_link)
    page_html = uClient.read()
    uClient.close()

    page_soup = soup(page_html, "html.parser")

    return page_soup.findAll("div", {"class": "sc_sccoursedescs"})[0].findAll("p", {"class": "courseblocktitle"})

def retrieve_course_names(category, title):
    course_code = re.findall("^[A-Z]{2,4}\s[0-9]{5}", title.text)[0]
    course_codelen = len(course_code)
    credit_hours = re.findall("(\\s+[0-9](\\-{0,1},{0,1}[0-9]{0,2}){0,1}\\sCredit\\sHour(s){0,1})$", title.text)[0][0]
    
    credit_hoursindex = title.text.find(credit_hours)
    course_title = title.text[course_codelen+6:credit_hoursindex]

    course_titles.append(f"{course_code},{course_title}")
    course_dicts.append(Course_Info(category, course_title, course_code))

def write_all_lists_to_file():
    write_list_to_file(class_list, "categories.csv")
    write_list_to_file(class_links, "class_links.csv")
    write_list_to_file(course_titles, "course_titles.csv")
    

def initialize_firestore_Connection():
    cred = credentials.Certificate("./ServiceAccountKey.json")
    firebase_admin.initialize_app(cred)
    return firebase_admin.firestore.client()

def create_category_documents(fs_client):
    for category in course_categories:
        data = {
            u'full_name': u"{0}".format(category[0]),
            u'short_name': u"{0}".format(category[1])
        }
        fs_client.collection(u"Courses").add(document_data=data, document_id=category[1])

def create_tag_documents(fs_client):
    for course in course_dicts:
        fs_client.collection(u"Courses").document(course.category_code).collection('courses').add(course.data())

class Course_Info(object):
    def __init__(self, category, full_name, short_name):
        self.full_name = full_name
        self.short_name = short_name
        self.category_title = category[0]
        self.category_code = category[1]

    def data(self):
        return {
            u'full_name': u"{0}".format(self.full_name),
            u'short_name': u"{0}".format(self.short_name)
        }


parse_class_list()