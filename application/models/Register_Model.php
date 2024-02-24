<?php if(!defined('BASEPATH')) exit('No direct script access allowed');
	class Register_Model extends CI_Model { 
		function __construct()
		{ 		
			parent::__construct();
		
		}

		function add($post)
		{
			
			$user = array('name'=>$post['name'],'email'=>$post['email'],'passowrd'=>$post['password'],'status'=>0);
			
			$this->db->insert('user',$user);
			
			if($this->db->affected_rows() > 0)
			{
				return 1;
			}
			else
			{
				return 0;
			}
		}

    }
    