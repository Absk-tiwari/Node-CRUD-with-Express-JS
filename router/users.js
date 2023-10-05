const express = require('express'); 
const router = express.Router();
const dbConn = require('../lib/db');

// Handling Requests

router.get('/',(req,res,next)=>{
    dbConn.query('SELECT * FROM users order by id desc', (err,rows)=>{
        if(err){
            req.flash('error',err);
            res.render('users',{data: {}});
        }else{
            res.render('users',{data: rows});
        }
    })
})

// Display Add user

router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('users/add', {
        name: '',
        email: '',
        position:''
    })
})

// Add a new User

router.post('/add', (req, res, next)=>{
    let name =  req.body.name;
    let email = req.body.email;
    let position = req.body.position;

    let errors = false;
    if(name.length===0 || email.length===0 || position.length ===0){
        errors = true;
        // Yeah it will show up a flash display error ! wow
        req.flash('error',"Please enter your name and email and position");

        // returning back the view again 
        req.render('users/add',{
            name : name,
            email : email,
            position : position
        });
    }

    if(!errors){
        var formData = {
            name : name ,
            email : email,
            position :position
        }

        dbConn.query('INSERT INTO users SET ?', formData, function(err, result){
            if(err){
                req.flash('error',err);
                res.render('users/add',{
                    name : formData.name,
                    email : formData.email,
                    position: formData.position
                });
            }else{
                req.flash('success', 'User Succesfully created!');
                res.redirect('/users');
            }
        })
    }
})

// display edit page , yeah it is going to be longer code for sure 

router.get('/edit/(:id)', (req,res, next)=>{
    let id= req.params.id;

    dbConn.query('SELECT * FROM users where id = ?',[id], (err,rows)=>{
        if(err) throw err;
        if(rows.length>0){
            res.render('users/edit',{
                title : 'Edit User',
                id:  rows[0].id,
                name:  rows[0].name,
                email:  rows[0].email,
                position:  rows[0].position,
            })
        }else{
            req.flash('error', 'No records found for user id - '+id);
            res.redirect('/users')
        }
    })
});

// was not much though
// Update the data  of the user

router.post('/update/:id', (req, res, next)=>{
     let id = req.params.id;
     let name = req.body.name;
     let email = req.body.email;
     let position = req.body.position;
     let error = false;
     if(name.length===0 || email.length===0 || position.length===0){
        error = true;
     }
     if(!error){

        let formData = {
            name : name, 
            email : email,
            position : position
        };

        dbConn.query('UPDATE users set ? where id= '+id ,formData, (err, result)=>{
            if(err) {
                req.flash('error', err) ; 
                console.log(err.sql); 
                res.render('users/edit',{
                    id : id,
                    name : formData.name,
                    email : formData.email,
                    position : formData.position
                })
            }else{
                req.flash('success','User information updated successfully!');
                res.redirect('/users');
            }
        });

     }

});

// Delete a user

router.get('/delete/(:id)', (req, res, next)=>{
    let id = req.params.id;
    dbConn.query('DELETE FROM users where id =  '+id , (err, result)=>{
        if(err){
            req.flash('error', 'Couldn\'t Delete!'); console.log(err);
            res.redirect('/users');
        }else{
            req.flash('success', 'User deleted successfully!');
            res.redirect('/users');
        }
    })
});


module.exports = router;