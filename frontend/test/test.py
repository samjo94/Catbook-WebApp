#!/usr/bin/env python
# -*- coding: utf-8 -*-

import selenium
from selenium import webdriver
import os
import time
import unittest
from selenium.webdriver.common.action_chains import ActionChains


class CatBookTest(unittest.TestCase):
    def setUp(self):
        self.current_directory = os.getcwd()
        self.PATH = self.current_directory + "/chromedriver"
        self.driver = webdriver.Chrome(self.PATH)
        self.url = "http://127.0.0.1:3000"
        self.driver.get(self.url)

    def test_a_signup(self):

        signup = self.driver.find_element_by_id("signup")
        signup.click()
        time.sleep(1)

        username = "Whiskers"
        email = "whiskers@adress.com"
        password = "password"

        email_field = self.driver.find_element_by_id("email")
        email_field.send_keys(email)


        username_field = self.driver.find_element_by_id("username")
        username_field.send_keys(username)


        password_field = self.driver.find_element_by_id("password")
        password_field.send_keys(password)


        signupbutton = self.driver.find_element_by_id("signupbutton")
        signupbutton.click()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, self.url + "/login")

#####################################
        signup = self.driver.find_element_by_id("signup")
        signup.click()
        time.sleep(1)
        username = "Meowchael Jackson"
        invalid_email = "thisisnotanemail"
        password = "pass123"

        email_field = self.driver.find_element_by_id("email")
        email_field.send_keys(invalid_email)


        username_field = self.driver.find_element_by_id("username")
        username_field.send_keys(username)

        password_field = self.driver.find_element_by_id("password")
        password_field.send_keys(password)

        signupbutton = self.driver.find_element_by_id("signupbutton")
        signupbutton.click()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, self.url + "/signup")

        email_field.clear()
        email_field.send_keys("okifix@hotmail.com")
        signupbutton.click()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, self.url + "/login")
##############################

    def test_b_login(self):
        time.sleep(1)
        email = "whiskers@adress.com"
        password = "password"
        loginbutton = self.driver.find_element_by_id("loginbutton")
        loginbutton.click()
        time.sleep(1)

        email_field = self.driver.find_element_by_id("login_email_field")
        email_field.send_keys(email)

        password_field = self.driver.find_element_by_id("login_password_field")
        password_field.send_keys(password)

        loginbutton = self.driver.find_element_by_id("login_button_field")
        loginbutton.click()
        time.sleep(1)

        myprofilebutton = self.driver.find_element_by_id("myprofile_button")
        assert(myprofilebutton)
        logoutbutton = self.driver.find_element_by_id("logout_button")
        assert(logoutbutton);
        myprofilebutton.click()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, self.url + "/profile/Whiskers")
        message_field = self.driver.find_element_by_id("message_field")
        assert(message_field)
        submit_message_button = self.driver.find_element_by_id("submit_message_button")
        assert(submit_message_button)
        print(self.driver.find_element_by_id("userheader").text)
        self.assertEqual("Whiskers", self.driver.find_element_by_id("userheader").text)


    def test_c_publish_message(self):
        time.sleep(1)
        email = "whiskers@adress.com"
        password = "password"
        loginbutton = self.driver.find_element_by_id("loginbutton")
        loginbutton.click()
        time.sleep(1)

        email_field = self.driver.find_element_by_id("login_email_field")
        email_field.send_keys(email)

        password_field = self.driver.find_element_by_id("login_password_field")
        password_field.send_keys(password)

        loginbutton = self.driver.find_element_by_id("login_button_field")
        loginbutton.click()
        time.sleep(1)

        myprofilebutton = self.driver.find_element_by_id("myprofile_button")
        assert(myprofilebutton)
        logoutbutton = self.driver.find_element_by_id("logout_button")
        assert(logoutbutton);
        myprofilebutton.click()
        time.sleep(1)

        message_field = self.driver.find_element_by_id("message_field")
        submit_message_button = self.driver.find_element_by_id("submit_message_button")
        message_field.send_keys("Message sent to myself")
        submit_message_button.click()
        time.sleep(1)

        message = self.driver.find_elements_by_class_name("message")
        print(message)
        self.assertEqual(message[0].text, "Message sent to myself")


    def test_d_send_friend_request(self):
        signup = self.driver.find_element_by_id("signup")
        signup.click()
        time.sleep(1)

        username = "User2"
        email = "user2@adress.com"
        password = "password"

        email_field = self.driver.find_element_by_id("email")
        email_field.send_keys(email)

        username_field = self.driver.find_element_by_id("username")
        username_field.send_keys(username)

        password_field = self.driver.find_element_by_id("password")
        password_field.send_keys(password)

        signupbutton = self.driver.find_element_by_id("signupbutton")
        signupbutton.click()
        time.sleep(1)

        email = "whiskers@adress.com"
        password = "password"
        loginbutton = self.driver.find_element_by_id("loginbutton")
        loginbutton.click()
        time.sleep(1)

        email_field = self.driver.find_element_by_id("login_email_field")
        email_field.send_keys(email)

        password_field = self.driver.find_element_by_id("login_password_field")
        password_field.send_keys(password)

        loginbutton = self.driver.find_element_by_id("login_button_field")
        loginbutton.click()
        time.sleep(1)

        self.driver.get(self.url + "/profile/User2")

        time.sleep(1)
        addfriendbutton = self.driver.find_element_by_id("addfriend")
        assert(addfriendbutton)
        addfriendbutton.click()
        time.sleep(1)
        logoutbutton = self.driver.find_element_by_id("logout_button")
        assert(logoutbutton)
        logoutbutton.send_keys('\n')
        time.sleep(2)


    def test_e_accept_request(self):
        loginbutton = self.driver.find_element_by_id("loginbutton")
        loginbutton.click()
        time.sleep(1)
        email = "user2@adress.com"
        password = "password"

        email_field = self.driver.find_element_by_id("login_email_field")
        email_field.send_keys(email)
        password_field = self.driver.find_element_by_id("login_password_field")
        password_field.send_keys(password)
        loginbutton = self.driver.find_element_by_id("login_button_field")
        loginbutton.click()
        time.sleep(1)

        myprofilebutton = self.driver.find_element_by_id("myprofile_button")
        myprofilebutton.click()

        time.sleep(1)

        acceptbutton = self.driver.find_element_by_id("acceptbutton")
        assert(acceptbutton)
        acceptbutton.click()
        time.sleep(1)


    def test_f_search(self):
        search_bar = self.driver.find_element_by_class_name("rbt-input-hint")
        time.sleep(1)
        time.sleep(2)
        actions = ActionChains(self.driver)
        actions.click(on_element = search_bar)
        actions.send_keys("Whiskers")
        actions.perform()
        time.sleep(3)
        search_results = self.driver.find_element_by_id("Whiskers")
        search_results.click()
        time.sleep(2)
        self.assertEqual(self.driver.current_url, self.url + "/profile/Whiskers")


if __name__ == "__main__":
    unittest.main()
