var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const cors = require('cors');

app.use(cors());

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'park1234',
    database: 'admin'
});

connection.connect(function (err) {
    if (err) throw err;

    console.log("Connected!")
});

app.get('/', (req, res) => {
    res.json("Hello World !");
})

app.get('/db', (req, res) => {
    connection.query("SELECT * FROM mboard", (err, result, field) => {
        if (err) throw err;
        return res.json(result);
    });
});

app.get('/admin', (req, res) => {
    connection.query('SELECT * FROM mboard', (err, result) => {
        var contentsInputArea = () => {
            if (result.length < 5) return `
          <div>
          <h2><u>Node_MySQL Practice</u></h2><br>
          <form method='post', action='/admin/add', accept-charset='utf-8'>
            <div>
              <div class='input_' ><p>Date : </p></div><input type='text', name='date', placeholder="Ex) 2020-02-01" />
            </div>
            <div>
              <div class='input_' ><p>Student : </p></div><input type='text', name='student' placeholder="Ex) CHAEYEON" />
            </div>
            <div>
              <div class='input_' ><p>Mask : </p></div><input type='text', name='mask' placeholder="Ex) Y/N" />
            </div>
            <div>
              <div class='input_' ><p>Count : </p></div><input type='text', name='count' placeholder="Ex) 1" />
            </div>
            <div><input type='submit' style='width:auto;' /></div>
          </form>
        </div>`;
            return `<p>Error</p>`;
        };

        var contentsTableArea = () => {
            if (result.length < 1) return `<td>NOT DATA !</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>`;
            var tablecontents = result.map((e) => `<tr>
          <td>${e['id']}</td>
          <td>${e['date']}</td>
          <td>${e['student']}</td>
          <td>${e['mask']}</td>
          <td>${e['count']}</td>
          <td><a href='' >UP</a></td>
          <td><a href='' >DOWN</a></td>
          <td><a href='/admin/update', method = 'write' >UPDATE</a></td>
          <td> 
            <form action='/admin/delete', method='post', accept-charset='utf-8'>
              <input type="hidden" name="id" value="${e['id']}" />
              <input type="submit" value="삭제"  />
            </form>
          <td/>
        </tr>`);
            return tablecontents.reduce((startV, endV) => startV + endV);
        }

        res.send(
            `
      <html>
        <head>


          <style>
               
          
            * {  
            
  margin-top: 1.5px;
  margin-bottom:1.5px;
  padding: 0;
  text-align:center;
}

body {
  background-color: #fafafa;
}

table {
  color: #333;
  font-size: .9em;
  font-weight: 300;
  line-height: 40px;
  border-collapse: separate;
  border-spacing: 0;
  border: 2px solid #1c68ae;
  width: 1000px;
  margin: 50px auto;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);
  border-radius: 2px;
}

th {
  background: #548cb1;
  color: #fff;
  border: none;
}




input[type="button"],select {
    transition: all .3s;
    border: 1px solid #ddd;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 5px;
\tfont-size: 15px;
}

input[type="button"]:not(.active) {

background-color: #643864;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
  margin-bottom: auto;
}

.active {
background-color: #214c6b;
color :#fff;
}


input[type=text] {
  width: 60%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

input[type=submit] {
  margin-top: 5%;
  width: 60%;
  padding: 12px;
  border: 1px solid #2b7e7b;
  border-radius: 4px;
  resize: vertical;
}



          </style>
        </head>
        <body>
          ${contentsInputArea()}
          <div>
            <table class='t1'>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>NAME</th>
                <th>MASK</th>
                <th>COUNT</th>
                <th>UP</th>
                <th>DOWN</th>
                <th>UPDATE</th>
                <th>DELETE</th>
              </tr>
              ${contentsTableArea()}
            </table>
          </div>
        </body>
        </html>
      `
        );
    })
});


app.post('/admin/add', (req, res) => {
    var result = req.body;
    // console.log([result.date, result.student, result.mask, result.count])
    if (false) return res.json(false);
    else {
        connection.query(
            'INSERT INTO mboard (date, student, mask, count) VALUES(?, ?, ?, ?)',
            [result.date,
                result.student,
                result.mask,
                result.count],
            (err,) => {
                console.log([result.date, result.student, result.mask, result.count])
                console.log(err, result);

                if (err) throw err;
                res.setHeader("Content-Type", "application/json");
                return res.json(true);
            });
        return false;
    }
    ;
});

app.get('/admin/users', (req, res) => {
    var result = req.body;
    // console.log([result.date, result.student, result.mask, result.count])
    connection.query(
        'SELECT * FROM mboard',
        function (err, rows) {
            if (err) {
                console.log('Encountered an error:', err.message);

                res.headers.add('Access-Control-Expose-Headers', 'Content-Range');
                res.headers.add('Content-Range', 'bytes : 0-9/*');

                return res.send(500, err.message);
            }

            res.json(rows);
        }
    );
});


app.post('/admin/delete', (req, res) => {
    var id = req.body.id;
    connection.query('DELETE FROM mboard WHERE id=?', [id], (err, result) => {
        if (err) throw err;
        return res.redirect('/admin');
    });
});


app.post('/admin/update', (req, res) => {
    var id = req.body.id;
    connection.query('UPDATE mboard set title WHERE id=?', [id], (err, result) => {
        if (err) throw err;
        return res.redirect('/admin');
    });
});

function dataFormatCheck({date, mask}) {
    var txtSplitList = date.split('-');
    if (txtSplitList.length < 3) return true
    return maskCheck(mask);
}

function maskCheck(mask) {
    if (mask.length < 2) return true;
    return false;
}

app.listen(4000, () => console.log('localhost:4000/admin'));
