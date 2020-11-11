# 🛠 Node Admin Mini Project

Node.js(Express)와 MySQL 연동

## 📝 사용언어, 기술스택

![Generic badge](https://img.shields.io/badge/flatform-NodeJS-skyblue.svg)
![Generic badge](https://img.shields.io/badge/framework-Express-green.svg)
![Generic badge](https://img.shields.io/badge/Database-Mysql-red.svg)
![Generic badge](https://img.shields.io/badge/ORM-Sequelize-black.svg)


<br><br>

## 📕 주요 NPM version
| 패키지명 | 버전 | 설명 |
| -------- | ---- | ---- |
| Express.js|  [![NPM Version](https://img.shields.io/npm/v/express.svg)](https://npmjs.org/package/express)| Node.js 의 프레임워크 |
| Mysql|  [![NPM Version](https://badgen.net/npm/v/mysql)](https://www.npmjs.com/package/mysql)| 데이터베이스 |
| CORS|  [![NPM Version](https://img.shields.io/npm/v/cors.svg)](https://www.npmjs.com/package/cors)|미들웨어(CORS 에러 해결)|
|Body-Parser|[![NPM Version](https://img.shields.io/npm/v/body-parser.svg)](https://npmjs.org/package/body-parser)|미들웨어(POST 요청 데이터 추출)|



<br>

## 🎛 Mysql DB Structure

<img width="1047" alt="mysqldb" src="https://user-images.githubusercontent.com/61309080/98805792-7cd6ae00-245b-11eb-95d0-63e2eb121ef9.png">

```
CREATE SCHEMA customer_services;

GO

CREATE TABLE mboard
(
    date    date        not null,
    student varchar(50) not null,
    mask    varchar(30) not null,
    count   int         not null,
    id      int auto_increment
        primary key
);

```



## 🔐 API LIST

### CONNECT Request(with SQL)

```
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: [USERNAME],
    password: [PASSWORD],
    database: 'admin'
});

connection.connect(function (err) {
    if (err) throw err;

    console.log("Connected!")
});


```


### 🖥 '/admin': Main Page

#### 1. 최종화면

<img width="1255" alt="스크린샷 2020-11-11 오후 7 42 28" src="https://user-images.githubusercontent.com/61309080/98807737-7138b680-245e-11eb-9930-c5ae44f5e574.png">

#### 2. API Code

```
app.get('/admin', (req, res) => {

connection.query('SELECT * FROM mboard', (err, result) => {
    var contentsInputArea = () => {html file}
    var contentsTableArea = () => {
    
    //DB에 데이터 없을 경우 
    if (result.length <1) return `NO DATA`;
   
    var tablecontents = result.map((e) => `html file`);
    
    //만들어 놓은 Input Area + Table Data
    return tablecontents.reduce((startV, endV) => startV + endV);
    
    }
    
    res.send(`css + html final file`);
}

}
```
#### 3. Description

### 🖥 '/admin/add': Add function Page

#### 1. 최종 결과

Main Page에서 submit을 받아서 DB에 저장 성공한 경우 -> Return 성공! <br>
                                   실패한 경우 -> Return 실패!


2. API Code
```
app.get('/admin/add', (req, res) => {
connection.query('SELECT * FROM mboard', (err, result) => {
   'INSERT INTO mboard (date, student, mask, count) VALUES(?, ?, ?, ?)',
   // JSON 형태로 넘겨주기
            [result.date,
                result.student,
                result.mask,
                result.count]
                
  (err) => {if (err) throw err;
            res.setHeader("Content-Type", "application/json");
            return res.json(true);}

  return false;
}

```

### 🖥 '/admin/users': JSON 파일 화면에 렌더링

#### 1. 최종 결과

#### 2. API CODE

```
app.get('/admin/users', (req, res) => {
 connection.query(
        'SELECT * FROM mboard',
        function (err, rows) {
            if (err) {
                //Error 메세지 console
                console.log('Encountered an error:', err.message);
                res.headers.add('Access-Control-Expose-Headers', 'Content-Range');
                res.headers.add('Content-Range', 'bytes : 0-9/*');
                return res.send(500, err.message);
            }
            //JSON으로 출력
            res.json(rows);
        }
    );
}
```

#### 3.Description

##### Parameter

#### Response
