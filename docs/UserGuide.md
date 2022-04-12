# Productivity Police User Guide

## Authentication and login
* This is a landing page will be shown to first-time users on app launch and will allow users to login or sign up via email.

* Users can send themselves a forget password email where they can then reset their password should they forget their passwords

* An email verification email will be sent to every newly created account for users to verify their account emails

* Logged in users will not be required to re login each time they enter the app if they did not sign out when they were using the app.

![Auth](https://user-images.githubusercontent.com/85099754/162939544-e122e356-76d4-44bf-8ff4-7b37052e556c.gif)


## Home screen and navigation side bar
* The home page is the first page users will see after signing up or signing in. It is a summary of all the important information from the various features in our app that the user will find useful to know just by being in the home page. 

* The homepage consists of the user’s profile picture, username, number of outstanding tasks, current level and EXP from the pomodoro timer, time set for daily sleep reminders and alarms, as well as outstanding habits and long term goals yet to complete. 

* Clicking on each feature will also bring the user to the main page of that specific feature.

* Any changes that the user makes in each feature will be reflected in the home page and updated in real time. 

* Furthermore, when clicking the menu button, users can open up a “drawer” where it provides different navigations that access the different features of the app when each feature is clicked. 

![drawer](https://user-images.githubusercontent.com/85099754/162945947-cacfe459-6c8a-46bd-a949-b85b23f3c4fe.gif)

## To do list
* This is a page where users can create their daily to-do-list. Users can create their tasks with the + at the top right corner of the tasks screen which leads them to a page to fill in the necessary details of their task. Tasks will be created if the user's task passes the validation criterias in the various fields in the creation form.

* The tasks created are stored in a list view for easy viewing and are sorted by their categories. Within each category, the tasks are then again sorted by urgency, where the task to complete first will be displayed at the top.

* For each task created, there is a checkbox at the left hand side of the task where users can toggle the completion status of the task. They can also edit or delete any task they desire with the buttons on the right. There is also a description at the bottom updating in real time to let users know how long there is left to the start of that task. Lastly, they can tap into each task to view the details of their task.

![todolist](https://user-images.githubusercontent.com/85099754/162945649-df75c267-5ccd-43f8-9a66-e4eaae4c22f7.gif)

* Users will receive push notifications at the time and date they set for the task to remind them to do the task.

![todolist_notif](https://user-images.githubusercontent.com/85099754/162945689-9dc89762-d750-494f-8f15-cb3c247a0e7e.gif)


## Focus timer
* The focus timer is a page that consists of two different features, one simple timer and another, a timer that is influenced by the pomodoro study technique.

* The two different features can be accessed by the two different buttons which will take the user to a separate screen showing the feature they have chosen. 

* In the standard timer feature, you can set duration for the timer using the “Set duration” button, the duration will be shown on the standard timer page under the hours, minutes and seconds circles. When the “Start timer” button is clicked, the timer will begin for whatever time the user decided to set. When the timer starts, the user can restart the timer or pause/start the timer. The back button will bring the user back to the standard timer page.

![normaltimer](https://user-images.githubusercontent.com/85099754/162946931-7d0fe8bc-e5d4-4b01-9249-23b0f6e9daff.gif)


* In the pomodoro feature, a level and exp progress bar is shown, where it keeps track of the exp a user gained from using the pomodoro study technique. The user gets 50 EXP for each study cycle, and 100 bonus exp by completing one full pomodoro cycle. At different levels, users unlock a different badge that will be displayed on the main page of the focus timer, namely at level 20, 40, 60, 80 and 100 respectively. 

* User can also set custom pomodoro durations that obey the same cycle order but with different durations. However, only a pomodoro cycle with study time larger than or equal to 25 mins, short break of duration 5 minutes, long break of duration 15 minutes will be eligible for EXP gain. This is to prevent people from abusing the pomodoro cycles and gaining exp quickly. For the demo app we have provided, all cycles have been set to 5 seconds so that testers do not need to complete 25, 5, 15 mins of each cycle to gain EXP. 

* To learn more about the Pomodoro cycle, one can click on the question mark icon to open a pop up to learn more about the rules about this feature as well as learn more about the Pomodoro study technique!

![pomodoro](https://user-images.githubusercontent.com/85099754/162946679-61cedc4a-f910-4241-81aa-13867d4800d0.gif)


## Sleep
* This page consists of 2 sub features of the sleep feature, power nap and alarm setting. The alarm setting feature allows users to set daily alarms that wake them up in the morning and reminder notifications that remind users to stop procrastinating on sleep and sleep at a certain time they fix.

![dailyAlarm](https://user-images.githubusercontent.com/85099754/162948235-b085ffa0-76ca-4b82-96cb-3581f7310339.gif)

* On the other hand, the nap feature allows people to set quick nap times and snooze when needed. 
* Both features work similarly, where the user is given a set of recommended time/duration for alarms and power naps respectively. Users can use the picker to set their own time/duration manually as well. To save such changes, the user just has to click the tick button and their new daily alarm timings will be set or they can start their naps. 

![powerNap](https://user-images.githubusercontent.com/85099754/162948440-866536e6-6f53-4312-9b89-6c584cdbba65.gif)


* To understand more about the optimal nap timings and sleep schedules, a question mark icon can be clicked at the top of the screen which will open up a pop up view to give users an understanding of what is best for them. 

## Goal Setting
* This feature has 2 sub-features namely habits and long term goals.
### Habits
* The habits feature allows users to set recurring goals over intervals of the user’s choice (daily, weekly, monthly). Users can create the habit with the + button at the top right hand corner and fill in the necessary details and select the options they want in the form. Their habit will be created if the user's habit passes the validation criterias in the various fields in the creation form.

* Once they create the habit, they can tap the progress circle to update their progress. For habits recorded by ‘times’ tapping it would increment the time count by 1 and increment the progress circle by the appropriate percentage. For habits recorded by ‘minutes’ or ‘hours’ tapping the circle would give them an option to fully complete the habit or enter a manual log 

* The habits reset at the end of their intervals automatically and a streak counter will show how many consecutive intervals that a user has completed that particular habit. Streak counters break if users miss an interval.

* An hourglass icons appears to remind users to complete their habit if users have yet to complete their habit and there is only < 25% of the interval duration left 

![habits](https://user-images.githubusercontent.com/85099754/162942431-46aa79cc-670d-4a57-80ae-a6fcdb37bac0.gif)

* Users can edit and delete the habit as per usual and opt for daily notification reminders at the timings of their choice

![habits_notif](https://user-images.githubusercontent.com/85099754/162942617-7962098a-2a6d-46af-b523-042267a8929b.gif)



### Long term goals
* For the long term goals feature, users can create their goal with the + button at the top right hand corner and fill in the necessary details and select the number of checkpoints they want in the form. Their goal will be created if the user's goal passes the validation criterias in the various fields in the creation form

* They can set a long term goal with checkpoints to check in on their progress at specific time intervals. In each checkpoint, they can write what they want to do daily, weekly and monthly to achieve their end goals

![longTermGoal](https://user-images.githubusercontent.com/85099754/162943771-071c8ba5-2aee-4f4b-b842-bf7d016c46d6.gif)

* Users will receive notifications when any checkpoint or goal has been completed and they can then write notes to do a reflection on their performance for that particular checkpoint or goal they have just completed. 

![longTermGoalNotif](https://user-images.githubusercontent.com/85099754/162944218-31cdeada-e510-450e-a397-8f905398ba21.gif)

* In the notes, users can give themselves a rating on their performance and write down areas they can improve on or reflect on how they have done in general. This notes section can only be accessed once the goal or checkpoint is completed.

![longTermGoalNotes](https://user-images.githubusercontent.com/85099754/162944245-e12181d7-c970-4e41-bd85-9d7a4223cba3.gif)

* Checkpoints and goals complete automatically once the date and time of that checkpoint or goal is reached and users can edit and delete the goal as per other features in the app. Lastly, users can tap into each goal to navigate to the goals details page and tap into each checkpoint to navigate to their checkpoint details page.

![longTermGoalEdit](https://user-images.githubusercontent.com/85099754/162944304-8770b91e-bf7d-412c-9664-4546c8cf0553.gif)


## Profile page
* A quick information page of the current logged user. This page displays essential information like username, email address.

* Users can change their profile picture for their accounts by clicking on the edit profile and then tapping the change profile picture icon

![profile1](https://user-images.githubusercontent.com/85099754/162941864-26c23769-05e9-4f9a-90e0-ddbe8660aa0e.gif)

* Users can also change their emails and username as well as send themselves a verification email to verify their account emails if they have lost the email sent the first time they created their accounts.

* Users can sign out from their account from this page

![profile2](https://user-images.githubusercontent.com/85099754/162942028-96b5a6ef-6c67-4884-aff2-97cc9f3c2f11.gif)





