var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');

// var path = require('path');
// const fs = require('fs');

var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 



const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

//   app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
  app.engine('.hbs', hbs.engine);

  // app.set('views', './views');
  app.set('view engine', 'hbs');

mongoose.connect(database.url).then(() => console.log('Connected Successfully')).catch((err) => { console.error(err); });

var Employee = require('./models/employee');

const Invoice = require('./models/invoice');
 
// inserting the data in the DB table 
app.post('/api/employees', function(req, res) {
    // Extracting data from the request body
    console.log("entered into post request  to insert data in database ")
    const newEmployeeData = {
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age
    };

    // Creating a new employee and then finding all employees
    Employee.create(newEmployeeData).then(employee => {
        return Employee.find();
    }).then(employees => {
        res.json(employees);
    }).catch(err => {
        res.send(err);
    });
});





//get all employee data from db
app.get('/api/employees', function(req, res) {
    Employee.find().then(employees => {
        res.json(employees); // return all employees in JSON format
    }).catch(err => {
        res.send(err);
    });
    
});


// get an employee based on  ID
app.get('/api/employees/:employee_id', function(req, res) {
    console.log("Went into the get request to get emplyee data based in the id ")
    let id = req.params.employee_id;
    Employee.findById(id)
    .then(employee => {
        res.json(employee);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});



app.put('/api/employees/:employee_id', function(req, res) {
    console.log(req.body);

    let id = req.params.employee_id;
    var data = {
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age
    }

    Employee.findByIdAndUpdate(id, data)
    .then(employee => {
        res.send('Successfully! Employee updated - ' + employee.name);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});



app.delete('/api/employees/:employee_id', function(req, res) {
    console.log(req.params.employee_id);
    let id = req.params.employee_id;
    Employee.findByIdAndDelete(id)
    .then(() => {
        res.send('Successfully! Employee has been Deleted.');
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

//*****************************************/ code for Part 2 of the assingment /*****************************************//


// Create new Invoice 

app.post('/api/invoices',async (req,res)=>{
    console.log("entered into post request  to insert new Invoice in database ")
    const invoice = new Invoice({
        ISBN: req.body.ISBN,
        img: req.body.img,
        title: req.body.title,
        author: req.body.author,
        inventory: req.body.inventory,
        category: req.body.category
    });

    try {
        const newInvoice = await invoice.save();
        res.status(201).json(newInvoice);
        console.log("Data Inserted successfully")
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

})


// Get all the data from database  based on the invoice f
// app.get('/api/invoices', async (req, res) => {
//     try {
//         const invoices = await Invoice.find();
//         res.json(invoices);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// fetch data using handelbars
app.get('/api/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.render('invoices', { invoices:invoices });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// get invoice by specific ID
app.get('/api/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).send('Invoice not found');
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// update data 
app.patch('/api/invoices/:id', async (req, res) => {
    const updates = {
        manufacturer: req.body.manufacturer,
        Price_in_thousand: req.body.Price_in_thousand
    };

    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, updates, { new: true });
        console.log("Data Updated succesfully")
        if (!invoice) {
            return res.status(404).send('Invoice not found');
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Deleting the record from databse 
app.delete('/api/invoices/:id', async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) {
            return res.status(404).send('Invoice not found');
        }
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// const PORT = process.env.PORT || 7000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

app.listen(port);
console.log("App listening on port : " + port);