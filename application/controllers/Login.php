<?php
    defined('BASEPATH') OR exit('No direct script access allowed');

    class Login extends CI_Controller {

        function __construct()
        {
            parent::__construct();

            $this->load->database();
            
            // $this->load->model('Register_Model');
            $this->load->library('session');
            $this->load->library('form_validation');
        }	

        public function index()
        {
            $this->load->view('login');
        }

        public function signup(){

            $this->load->view('signup');
        }

        public function register() {
            
            $name  = $this->input->post('name');
            $email = $this->input->post('email');
            $password = MD5($this->input->post('password'));

            $data = array(
                'name'=>$name,
                'email'=>$email,
                'password'=>$password,
                'role'=> 'Admin',
                'status'=> 0
            );
           
            // $sqlFecth = $this->db->query("SELECT * FROM user WHERE email = $email")->result();
          
            $sql = $this->db->insert('user', $data);
           
            if($sql == 1){

                echo "<script language=\"javascript\">alert('Sucessfull Registration');</script>";
                $this->index();
            }else{

                echo "<script language=\"javascript\">alert(' Registration not Sucessfull');</script>";
                $this->index();
            }
        }

        function Logout()
	    {    

		    $this->session->sess_destroy();
		    redirect(base_url('Login')); 
	    }

        public function Save(){
            
            $email = $this->input->post('email');
            $password = MD5($this->input->post('password'));


            $sqlFecth = $this->db->query("SELECT * FROM user WHERE email = '$email'")->result();
            
            // print_r($sqlFecth); exit();
            if($sqlFecth[0]->email == $email && $sqlFecth[0]->password === $password){

                // $newdata = array( 
                //     'u_id'  => $sqlFecth[0]->u_id, 
                //     'email'     => $sqlFecth[0]->email, 
                //     'logged_in' => TRUE
                //  );

                $ses = $this->session->set_userdata('u_id', $sqlFecth[0]->u_id);
                
                $sesRole = $this->session->set_userdata('role', $sqlFecth[0]->role);

                

                // print_r("---->".$user_id); exit();
                echo "<script language=\"javascript\">alert('Sucessfull Login');</script>";
                redirect('Dashboard/', 'refresh');
            
            }else {
                echo "<script language=\"javascript\">alert(' Login not Sucessfull');</script>";
                $this->index();
            }
           
            // $this->load->view('dashboard');
        }
    }
?>
