var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');

// var path = require('path');
// const fs = require('fs');

var port     = process.env.port || 8000;
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
const CarSales = require('./models/invoice');
 

app.get('/', function (req, res) {
    res.render('index', { title: 'Assignment 4' });
  });

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

// GET form to insert InvoiceNo
app.get('/api/insert', (req, res) => {
    res.render('InsertnewData');
  });
  

app.post('/api/invoices',async (req,res)=>{
    console.log("entered into post request  to insert new Invoice in database ")
    const invoice = new Invoice({
        InvoiceNo: req.body.InvoiceNo,
        image: req.body.image,
        Manufacturer: req.body.Manufacturer,
        class: req.body.class,
        Sales_in_thousands: req.body.Sales_in_thousands,
            Vehicle_type: req.body.Vehicle_type,
            Price_in_thousands: req.body.Price_in_thousands,
            Engine_size: req.body.Engine_size,
            Horsepower: req.body.Horsepower,
            Wheelbase: req.body.Wheelbase,
            Width: req.body.Width,
            Length: req.body.Length,
            Curb_weight: req.body.Curb_weight,
            Fuel_capacity: req.body.Fuel_capacity,
            Fuel_efficiency: req.body.Fuel_efficiency,
            Latest_Launch: req.body.Latest_Launch,
            Power_perf_factor: req.body.Power_perf_factor
    });

    try {
        const newInvoice = await invoice.save();
        res.status(201).json(newInvoice);
        console.log("Data Inserted successfully")
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});


// fetch data using handelbars
app.get('/api/invoices', async (req, res) => {
    try {
        const invoices = await CarSales.find();
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
        // res.json(invoice);
        res.render('invoices', { invoices:invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// update data 
app.patch('/api/invoices/:id', async (req, res) => {
    const updates = {
        Manufacturer: req.body.Manufacturer,
        Price_in_thousands: req.body.Price_in_thousands
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




app.listen(port);
console.log("App listening on port : " + port);