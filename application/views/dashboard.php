    <!DOCTYPE html>
    <html lang="zxx">
        <head>
            <title>Admin Dashboard</title>
        
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta charset="UTF-8" />
            <meta name="keywords" content="" />
        
            <link href="//fonts.googleapis.com/css2?family=Nunito:wght@300;400;600&display=swap" rel="stylesheet">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.css"rel="stylesheet">
            <link href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap4.min.css" rel="stylesheet">

            <link rel="stylesheet" href="<?php echo base_url(); ?>assets/css/admin.css" type="text/css" media="all" />
            
            <script src="https://kit.fontawesome.com/af562a2a63.js" crossorigin="anonymous"></script>
          
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
            <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
            <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
        </head>

        <body>
            <?php $role = $this->session->userdata('role');?>
            <div class="page-content page-container" id="page-content">
                <div class="padding">
                    <div class="row container d-flex justify-content-center">

                        <div class="col-lg-8 grid-margin stretch-card">
                            <div class="card">
                                <nav class="navbar navbar-expand-sm bg-light">
                                    <ul class="navbar-nav">
                                        <li class="nav-item">
                                            <a class="nav-link" href="#" data-toggle="modal" data-target="#mystd">Add Product</a>
                                        </li>
                                        <?php 
                                            $role = $this->session->userdata('role'); 
                                            $u_id = $this->session->userdata('u_id');

                                            $sqlFecth = $this->db->query("SELECT * FROM user WHERE u_id = $u_id")->result();
                                             
                                            $dd = $sqlFecth[0]->status;
                                            $username = $sqlFecth[0]->name;
                                           
                                            if($dd == 2) {
                                               
                                        ?>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#" data-toggle="modal" data-target="#mysub" >Add Product</a>
                                        </li>
                                        <?php }   ?>
                                          
                                        
                                        <li class="nav-item" >
                                            <a class="nav-link" href="<?php echo base_url(); ?>Login/Logout" style="margin-left:250px;"><?php echo $username?> ---Log Out</a>
                                        </li>
                                    </ul>
                                </nav>
                                <!-- For Product model-->
                                <div class="modal" id="mystd">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                        
                                            <!-- Modal Header -->
                                            <div class="modal-header">
                                                <center><h4 class="modal-title">Product Record</h4> </center>
                                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                            </div>
                                            
                                            <!-- Modal body -->
                                            <div class="modal-body">
                                  
                                                <form action="<?php echo base_url(); ?>Dashboard/productRecord" method="post">
                                                    <div class="form-group">
                                                        <label for="exampleInputName">Product Name</label>
                                                        <input type="text" class="form-control" id="exampleInputName" name="name" aria-describedby="nameHelp" placeholder="Enter Name">
                                                       
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="exampleInputEmail1">Product Number</label>
                                                        <input type="text" class="form-control" id="exampleInputEmail1" name="email" aria-describedby="emailHelp" placeholder="Enter email">
                                                       
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="exampleInputaddress">Product detail</label>
                                                        <input type="text" class="form-control" name="address" id="exampleInputaddress" placeholder="Address">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="exampleInputdob">Product Price</label>
                                                        <input type="text" class="form-control" name="dob" id="exampleInputdob" >
                                                    </div>
                                                    <input type="submit" class="btn btn-primary" name="submit" values="Submit">
                                                </form>
                                            </div>
                                            
                                            <!-- Modal footer -->
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                               
                                <div class="card-body">
                                    <center><h4 class="card-title">Records Table</h4> </center>
                                    <p class="card-description" style="text-align:center;">
                                        Product Record
                                    </p>
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th style="text-align: center;">Sr no.</th>
                                                    <th style="text-align: center;">Student</th>
                                                    <th style="text-align: center;">Max Scores</th>
                                                    <th style="text-align: center;">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php 
                                                    $sr = 1; 
                                                    foreach($stdFecth as $ALLvalue) {
                                                        $srno = $sr++;
                                                ?>
                                                <tr>
                                                    <td style="text-align: center;"><?php echo $srno; ?></td>
                                                    <td style="text-align: center;"><?php echo $ALLvalue->name; ?></td>
                                                    <td style="text-align: center;"><?php echo $ALLvalue->max_marks; ?></label></td>
                                                    <td style="text-align: center;">
                                                        <a data-toggle="modal" data-target="#myview_<?php echo $ALLvalue->s_id; ?>" href="<?php echo $ALLvalue->s_id; ?>"><i class='fas fa-eye' style='font-size:14px'></i></a>
                                                        <a data-toggle="modal" data-target="#myedit_<?php echo $ALLvalue->s_id; ?>" href="<?php echo $ALLvalue->s_id; ?>"><i class='fas fa-pencil-alt' style='font-size:14px'></i></a>
                                                        <a href="<?php echo base_url();?>Dashboard/recordDelete/<?php echo $ALLvalue->s_id ?> "><i class='fas fa-trash' style='font-size:14px'></i></a>
                                                        
                                                    </td>
                                                </tr>
                                                    <!-- For view model-->
                                                    <div class="modal" id="myview_<?php echo $ALLvalue->s_id; ?>">
                                                        <div class="modal-dialog">
                                                            <div class="modal-content">
                                                                <!-- Modal Header -->
                                                                <div class="modal-header">
                                                                    <h4 class="modal-title">Record</h4>
                                                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                                </div>
                                                                
                                                                <!-- Modal body -->
                                                                <div class="modal-body">
                                                                    <?php $scr = $this->db->query("SELECT * FROM Scores WHERE student = $ALLvalue->s_id")->result();?>
                                                                    <div class="form-group">
                                                                        <label for="stname">Student Name: </label> <?php echo $ALLvalue->name; ?>
                                                                        
                                                                    </div>
                                                                    <div class="form-group">
                                                                        <label for="stname">Email: </label> <?php echo $ALLvalue->email; ?>
                                                                        
                                                                    </div>
                                                                    <div class="form-group">
                                                                        <label for="stname">DOB: </label> <?php echo $ALLvalue->dob; ?>
                                                                        
                                                                    </div>
                                                                    <div class="form-group">
                                                                        <label for="exampleInputsname">Subject Name: </label><?php echo $ALLvalue->sname; ?>
                                                                    
                                                                    </div>
                                                                    <div class="form-group">
                                                                        <label for="exampleInputMarks">Marks:</label> <?php echo $scr[0]->marks; ?>
                                                                        
                                                                    </div>

                                                                    <div class="form-group">
                                                                        <label for="exampleInputMarks">Total Marks:</label> <?php echo $ALLvalue->max_marks; ?>
                                                                        
                                                                    </div>
                                                                    
                                                                </div>
                                                                
                                                                <!-- Modal footer -->
                                                                <div class="modal-footer">
                                                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- For view model-->

                                                    <!-- For Edit model-->
                                                    <div class="modal" id="myedit_<?php echo $ALLvalue->s_id; ?>">
                                                        <div class="modal-dialog">
                                                            <div class="modal-content">
                                                                <!-- Modal Header -->
                                                                <div class="modal-header">
                                                                    <h4 class="modal-title">Edit Record</h4>
                                                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                                </div>
                                                                
                                                                <!-- Modal body -->
                                                                <div class="modal-body">
                                                                    <?php 
                                                                        $edit = $this->db->query("SELECT * FROM student WHERE s_id = $ALLvalue->s_id ")->result();
                                                                    ?>
                                                                    <form action="<?php echo base_url(); ?>Dashboard/studentEditRecord" method="post">
                                                                        <div class="form-group">
                                                                            <input type="hidden" class="form-control"  name="id" aria-describedby="nameHelp" value="<?php echo $edit[0]->s_id; ?>">

                                                                            <label for="exampleInputName">Student Name</label>
                                                                            <input type="text" class="form-control" id="exampleInputName" name="name" aria-describedby="nameHelp" value="<?php echo $edit[0]->name; ?>">
                                                                        
                                                                        </div>
                                                                        <div class="form-group">
                                                                            <label for="exampleInputEmail1">Student Email</label>
                                                                            <input type="email" class="form-control" id="exampleInputEmail1" name="email" aria-describedby="emailHelp" value="<?php echo $edit[0]->email; ?>">
                                                                        
                                                                        </div>
                                                                        <div class="form-group">
                                                                            <label for="exampleInputaddress">Student Address</label>
                                                                            <input type="text" class="form-control" name="address" id="exampleInputaddress" value="<?php echo $edit[0]->address; ?>">
                                                                        </div>
                                                                        <div class="form-group">
                                                                            <label for="exampleInputdob">Student DOB</label>
                                                                            <input type="text" class="form-control" name="dob" disabled id="exampleInputdob" value="<?php echo $edit[0]->dob; ?>">
                                                                            
                                                                        </div>
                                                                        <input type="submit" class="btn btn-primary" name="submit" values="Submit">
                                                                    </form>
                                                                </div>
                                                                
                                                                <!-- Modal footer -->
                                                                <div class="modal-footer">
                                                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- For Edit model-->
                                                <?php } ?>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </body>
    </html>