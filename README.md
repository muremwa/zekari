# ZerakiAnalysis  

## Using the app
This is a simple app used by teachers, students and administrators.  

To sign in pick one of the following users:

```json
[
    {
        "username": "john",
        "password": "john123",
        "roles": ["TEACHER", "ADMIN"]
    },
    {
        "username": "jane",
        "password": "jane123",
        "roles": ["ADMIN"]
    },
    {
        "username": "doe",
        "password": "doe123",
        "roles": ["STUDENT"]
    },
    {
        "username": "tim",
        "password": "tim123",
        "roles": ["TEACHER"]
    }
]
```
An admin can view all pages; a student can only view `/students*` while a teacher can only view `/teachers*`  
They can all view `/home`

### Admin
Can view metrics of the all students and teachers.

### Student
Can view their latest results and a chart showing past performances to compared to previous results.

### Teacher
Can view their students. Can see a chart of each student performances.  
Can create and assign assignments.

## Mock data used
One Student - https://run.mocky.io/v3/3dd5116e-18d3-4ee1-af1a-0dc321a8080a  
Multiple Students - https://run.mocky.io/v3/999ea2ae-1868-445a-b838-ae93bd7ecebc  

Multiple Teachers - https://run.mocky.io/v3/666364de-c632-4b26-b67c-2a54b3aa1225  
One Teacher - https://run.mocky.io/v3/6bb6eace-68d9-459f-b4ec-7663788ac087  

Assignments - https://run.mocky.io/v3/05b03471-e08f-4727-b3d4-cffbbc62a85e  
Add Assignement - https://run.mocky.io/v3/e6ea341a-e81c-4378-9d14-cfde7e8012a4
