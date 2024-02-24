<!DOCTYPE html>
<html lang="zxx">

<head>
    <title>LOGIN</title>
   
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8" />
    <meta name="keywords" content="" />
  
    <link href="//fonts.googleapis.com/css2?family=Nunito:wght@300;400;600&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/css/style.css" type="text/css" media="all" />
    
    <script src="https://kit.fontawesome.com/af562a2a63.js" crossorigin="anonymous"></script>

</head>

<body>
   
    <section class="w3l-workinghny-form">
       
        <div class="workinghny-form-grid">
            <div class="wrapper">
                <div class="logo">
                    <h1><a class="brand-logo" href="#">login Admin</a></h1>
                </div>
                <div class="workinghny-block-grid">
                    <div class="form-right-inf">
                        <div class="login-form-content">
                            <h2>Login with email</h2>
                            <form action="<?php echo base_url(); ?>Login/Save" class="signin-form" method="post">
                                <div class="one-frm">
                                    <input type="email" name="email" placeholder="Email" required="" autofocus>
                                </div>
                                <div class="one-frm">
                                    <input type="password" name="password" placeholder="Password" required="">
                                </div>
                                <label class="check-remaind">
                                    <input type="checkbox">
                                    <span class="checkmark"></span>
                                    <p class="remember">Remember Me</p>
                                </label>
                                <input type="submit" class="btn btn-style mt-3" name="submit" id="submit" value="Login"/>
                                
                                <p class="already">Don't have an account? <a href="<?php echo base_url(); ?>Login/signup">Sign up</a></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="copyright text-center">
            <div class="wrapper">
                <p class="copy-footer-29"></p>
            </div>
        </div>
        
    </section>
   
</body>

</html>