var InvestorName='';
var LenderUID='';
var ProjectUID='';
var filetoupload = [];
var callUpdateTime = 45000;
function _asyncToGenerator(fn) {
	return function () {
		var gen = fn.apply(this, arguments);
		return new Promise(function (resolve, reject) {
			function step(key, arg) {
				try {
					var info = gen[key](arg);
					var value = info.value;
				} catch (error) {
					reject(error);
					return;
				}
				if (info.done) {
					resolve(value);
				} else {
					return Promise.resolve(value).then(function (value) {
						step("next", value);
					}, function (err) {
						step("throw", err);
					});
				}
			}
			return step("next");
		});
	};
}
var OrderEntryBtnID ='';
var btnclearexception_value = '';
var $button = $(this);
$(function () {

	$(document).off('click', '.cancel').on('click', '.cancel', function (e) {

		var OrderUID = $('#OrderUID').val();
		swal({
			title: 'Are you sure?',
			text: 'Do you want to discard the order!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, do it!',
			cancelButtonText: 'No, keep it',
			confirmButtonClass: "btn btn-success",
			cancelButtonClass: "btn btn-danger",
			buttonsStyling: false
		}).then(function (confirm) {

			$.ajax({
				type: "POST",
				url: base_url + "CommonController/UpdateNullStatus",
				data: {
					"OrderUID": OrderUID
				},
				dataType: 'json',
				beforeSend: function () {
					addcardspinner('#Orderentrycard');
				},

				success: function (response) {
					
					if (response.validation_error == 0) {
						$.notify({
							icon: "icon-bell-check",
							message: response.message
						}, {
							type: "success",
							delay: 1000
						});

						if (check_is_url_contains_string_value(window.location.href)) {
							window.location.href = base_url + response['URL'];
						} else {
							triggerpage(base_url + response['URL']);
						}
					} else {
						$.notify({
							icon: "icon-bell-check",
							message: response.message
						}, {
							type: "danger",
							delay: 1000
						});
					}
				}
			});
		}, function (dismiss) {});
	});

	$(document).off('change', '#Customer').on('change', '#Customer', function (e) {
		var CustomerUID = $(this).val();
		var id = $(this).attr('id');

		AjaxGetCustomerProjects(CustomerUID).then(function (response) {
		

			var Products = response.Products;

			Product_select = Products.reduce((accumulator, value) => {
				return accumulator + '<Option value="' + value.ProductUID + '">' + value.ProductName + '</Option>';
			}, '');

			if (id == 'Customer') {
				$('#Single-ProductUID').html(Product_select);
				$('#Single-ProductUID').val($('#Single-ProductUID').find('option:first').val()).trigger('change');
			} else if (id == 'bulk_Customers') {
				$('#bulk_ProjectUID').html(Project_select);
				$('#bulk_ProjectUID').val($('#bulk_ProjectUID').find('option:first').val()).trigger('change');
			}

			removecardspinner('#Orderentrycard');
			callselect2();
		}).catch(jqXHR => {
			console.log(jqXHR);
		});
	});

	$(document).off('change', '#bulk_Customers').on('change', '#bulk_Customers', function (e) {
		var CustomerUID = $(this).val();
		var id = $(this).attr('id');
		$('#bulk_ProductUID').empty();
		$('#bulk_ProjectUID').empty();
		$('#bulk_LenderUID').empty();
		$('.changeentryfilename').attr('disabled',true).addClass('disabled');
		$('.changeentryxmlfilename').attr('disabled',true).addClass('disabled');
		AjaxGetCustomerProducts(CustomerUID).then(function (response) {
			

			var CustomerProducts = response.CustomerProducts;

			Product_select = CustomerProducts.reduce((accumulator, value) => {
				return accumulator + '<Option value="' + value.ProductUID + '" data-type="' + value.BulkImportFormat + '" data-typename="' + value.BulkImportTemplateName + '"  data-typexmlname="' + value.BulkImportTemplateXMLName + '">' + value.ProductName + '</Option>';
			}, '');

			$('#bulk_products').html(Product_select);
			
			if(CustomerProducts.length > 0){
				$('#bulk_products').val($('#bulk_products').find('option:first').val()).trigger('change');
			}
			
			removecardspinner('#Orderentrycard');
			callselect2();
		}).catch(jqXHR => {
			console.log(jqXHR);
		});
	});


	$(document).off('change', '#Single-ProductUID').on('change', '#Single-ProductUID', function (e) {

		var currentrow = $('#Single-ProductUID').closest('.productsubproduct_row');
		var ProductUID = $('#Single-ProductUID').val();
		var CustomerUID = $('#Customer').val();

		var ProjectUID=$('#Single-ProjectUID').children("option:selected").val();

		var dataobject = {
			ProductUID: ProductUID,
			CustomerUID: CustomerUID,
		};

		Fetch_Product_DocType(dataobject);
	});


	/*ZipCode Change function*/

	$(document).off('blur', '#PropertyZipcode').on('blur', '#PropertyZipcode', function (event) {
		zip_val = $(this).val();
		if (zip_val != '') {
			addcardspinner('#Orderentrycard');
			$.ajax({
				type: "POST",
				url: base_url + 'CommonController/GetZipCodeDetails',
				data: {
					'Zipcode': zip_val
				},
				dataType: 'json',
				cache: false,
				beforeSend: function () {
					addcardspinner('#Orderentrycard');
				},
				success: function (data) {
					$('.PropertyCityName').empty();
					$('.PropertyStateCode').empty();
					$('.PropertyCountyName').empty();
					$('.MultiOrderedcity').html(' ');
					$('.MultiOrderedcounty').html(' ');
					$('.MultiOrderedstate').html(' ');

					if (data != '') {

						if (data['success'] == 1) {
							$("#zipcodeadd").hide();

							if (data['City'].length > 1) {
								$('.MultiOrderedcity').html(' ');
								$('.MultiOrderedcity').append('<span class="badge badge-danger cus-badge" style="background: #eb6357;color: #fff; z-index: 9999; top: -16px; right: -20px;">' + data['City'].length + '</span>');
							}

							if (data['County'].length > 1) {
								$('.MultiOrderedcounty').html(' ');
								$('.MultiOrderedcounty').append('<span class="badge badge-danger cus-badge" style="background: #eb6357;color: #fff; z-index: 9999; top: -16px; right: -20px;">' + data['County'].length + '</span>');
							}

							if (data['State'].length > 1) {
								$('.MultiOrderedstate').html(' ');
								$('.MultiOrderedstate').append('<span class="badge badge-danger cus-badge" style="background: #eb6357;color: #fff; z-index: 9999; top: -16px; right: -20px;">' + data['State'].length + '</span>');
							}

							$.each(data['City'], function (k, v) {
								$('#PropertyCityName').val(v['CityName']);
								$('.PropertyCityName').append('<li><a href="javascript:(void);" data-value="' + v['CityName'] + '">' + v['CityName'] + '</a></li>');
								$('#PropertyCityName').closest('.form-group').addClass('is-filled');
								zipcode_select();
							});

							$.each(data['County'], function (k, v) {
								$('#PropertyCountyName').val(v['CountyName']);
								$('.PropertyCountyName').append('<li><a href="javascript:(void);" data-value="' + v['CountyName'] + '">' + v['CountyName'] + '</a></li>');
								$('#PropertyCountyName').closest('.form-group').addClass('is-filled');
								zipcode_select();
							});

							$.each(data['State'], function (k, v) {
								$('#PropertyStateCode').val(v['StateCode']);
								$('.PropertyStateCode').append('<li><a href="javascript:(void);" data-value="' + v['StateCode'] + '">' + v['StateCode'] + '</a></li>');
								$('#PropertyStateCode').closest('.form-group').addClass('is-filled');
								zipcode_select();
							});

							$('#PropertyStateCode,#PropertyCountyName,#PropertyCityName').removeClass("is-invalid").closest('.form-group').removeClass('has-danger');
							$('#PropertyStateCode.select2picker,#PropertyCountyName.select2picker,#PropertyCityName.select2picker').next().find('span.select2-selection').removeClass('errordisplay');
						} else {
							$('#PropertyCityName').val('');
							$('#PropertyCityName').closest('.form-group').removeClass('is-filled');

							$('#PropertyCountyName').val('');
							$('#PropertyCountyName').closest('.form-group').removeClass('is-filled');

							$('#PropertyStateCode').val('');
							$('#PropertyStateCode').closest('.form-group').removeClass('is-filled');

							$("#zipcodeadd").show();
						}
					}
					removecardspinner('#Orderentrycard');
				},
				error: function (jqXHR, textStatus, errorThrown) {

					console.log(errorThrown);
				},
				failure: function (jqXHR, textStatus, errorThrown) {

					console.log(errorThrown);
				}
			});
		} else {
			$('#PropertyCityName').val('');
			$('#PropertyCityName').closest('.form-group').removeClass('is-filled');

			$('#PropertyCountyName').val('');
			$('#PropertyCountyName').closest('.form-group').removeClass('is-filled');

			$('#PropertyStateCode').val('');
			$('#PropertyStateCode').closest('.form-group').removeClass('is-filled');
		}
	});



$(document).off('click', '#discard').on('click', '#discard', function (e) {
	/*SWEET ALERT CONFIRMATION*/
	swal({
		title: '<div class="text-primary" id="iconchg"><i style="font-size: 40px;" class="fa fa-info-circle fa-5x"></i></div>',
		html: '<span id="modal_msg" class= "modal_spanheading" > Are you sure want to cancel this Order ?</span>',
		showCancelButton: true,
		confirmButtonClass: 'btn btn-success',
		cancelButtonClass: 'btn btn-danger',
		buttonsStyling: false,
		closeOnClickOutside: false,
		allowOutsideClick: false,
		showLoaderOnConfirm: true,
		position: 'top-end'
	}).then(function (confirm) {
		$('a[data-dismiss="alert"]').trigger('click');
		var OrderUID = $('#OrderUID').val();

		$.ajax({
			type: "POST",
			url: base_url + 'OrderComplete/OrderCancellation',
			data: {
				'OrderUID': OrderUID
			},
			dataType: 'json',
			cache: false,
			beforeSend: function () {
				addcardspinner('#Orderentrycard');
			},
			success: function (data) {
				if (data.validation_error == 0) {
					/*Sweet Alert MSG*/
					$.notify({
						icon: "icon-bell-check",
						message: data['message']
					}, {
						type: "success",
						delay: 1000
					});
					disposepopover();
					if (check_is_url_contains_string_value(window.location.href)) {
						window.location.href = base_url + 'MyOrders';
					} else {
						triggerpage(base_url + 'MyOrders');
					}
				} else {
					swal({
						title: "<i class='icon-close2 icondanger'></i>",
						html: "<p>" + data.message + "</p>",
						confirmButtonClass: "btn btn-success",
						allowOutsideClick: false,
						width: '300px',
						buttonsStyling: false
					}).catch(swal.noop);
				}
			},
			error: function (jqXHR) {
				swal({
					title: "<i class='icon-close2 icondanger'></i>",
					html: "<p>Failed to Complete</p>",
					confirmButtonClass: "btn btn-success",
					allowOutsideClick: false,
					width: '300px',
					buttonsStyling: false
				}).catch(swal.noop);
			}
		});
	}, function (dismiss) {});
});



$(document).off('click', '#reviewcomplete').on('click', '#reviewcomplete', function (e) {
	var button = $(this);
	var button_text = $(this).html();

	/*SWEET ALERT CONFIRMATION*/
	swal({
		title: '<div class="text-primary" id="iconchg"><i style="font-size: 40px;" class="fa fa-info-circle fa-5x"></i></div>',
		html: '<span id="modal_msg" class= "modal_spanheading" > Do you want to complete Review ?</span>',
		showCancelButton: true,
		confirmButtonClass: 'btn btn-success',
		cancelButtonClass: 'btn btn-danger',
		buttonsStyling: false,
		closeOnClickOutside: false,
		allowOutsideClick: false,
		showLoaderOnConfirm: true,
		position: 'bottom-middle'
	}).then(function (confirm) {

		$(button).prop('disabled', true);
		$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing');

		if (is_url_contains_string('Indexing')) {

			fn_save_stacking().then(function (response) {

				fn_review_complete(button, button_text);
			}).catch(function (error) {});
		} else if (is_url_contains_string('Audit')) {

			fn_autosave_auditing().then(function (response) {
				fn_review_complete(button, button_text);
			}).catch(function (error) {});
		} else {
			fn_review_complete(button, button_text);
		}
	}, function (dismiss) {});
});

$(document).off('submit', '#raiseexcetion').on('submit', '#raiseexcetion', function (e) {

	e.preventDefault();
	e.stopPropagation();
	var OrderUID = $('#OrderUID').val();

	var button = $('.btnraiseexcetion');
	var button_text = $('.btnraiseexcetion').html();

	$(button).prop('disabled', true);
	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Raising');

	var formdata = new FormData($(this)[0]);
	formdata.append('OrderUID', OrderUID);

	if (is_url_contains_string('Indexing')) {

		fn_save_stacking().then(function (response) {

			fn_raise_exception(formdata, button, button_text);
		}).catch(function (error) {});
	} else if (is_url_contains_string('Audit')) {

		fn_autosave_auditing().then(function (response) {
			fn_raise_exception(formdata, button, button_text);
		}).catch(function (error) {});
	} else {
		fn_raise_exception(formdata, button, button_text);
	}
});

$(document).off('click', '.btnclearexception').on('click', '.btnclearexception', function (e) {
	btnclearexception_value = $(this).val();
	$button = $(this);
});

$(document).off('submit', '#frmclearexception').on('submit', '#frmclearexception', function (e) {

	e.preventDefault();
	e.stopPropagation();
	var OrderUID = Const_ORDERUID;

		// var $button = $('.btnclearexception');
		var button = $button;
		var button_text = $button.html();

		$(button).prop('disabled', true);
		$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Clearing');

		// var $submitbuttons = $('.btnclearexception');

		var formdata = new FormData($(this)[0]);
		formdata.append('OrderUID', OrderUID);
		formdata.append('submit', btnclearexception_value);

		if (is_url_contains_string('Indexing')) {

			fn_save_stacking().then(function (response) {

				fn_clear_exception(formdata, button, button_text);
			}).catch(function (error) {});
		} else if (is_url_contains_string('Audit')) {

			fn_autosave_auditing().then(function (response) {
				fn_clear_exception(formdata, button, button_text);
			}).catch(function (error) {});
		} else {
			fn_clear_exception(formdata, button, button_text);
		}
	});

$(document).off('submit', '#frm_orderreverse').on('submit', '#frm_orderreverse', function (e) {
	e.preventDefault();
	e.stopPropagation();
	var OrderUID = $('#OrderUID').val();
	var WorkflowUID =$('#ReverseStatusUID').val();


	$.ajax({
		type:"POST",
		url : base_url + 'OrderComplete/WorkflowOrderReverse',
		data:{OrderUID:OrderUID,WorkflowUID:WorkflowUID,VerifyBinOrder:'BinOrderRemove'},
		dataType :"json",
		cache: false,
		beforeSend: function () {
		},
		success :function(response){
			console.log(response);
			if (response.validation_error == 1) {
				$.notify(
				{
					icon:"icon-bell-check",
					message:response.message
				},
				{
					type:"success",
					delay:1000 
				});

				$('#modal-OrderReverse').modal('hide');


				if (check_is_url_contains_string_value(window.location.href)) {
					window.location.href = response['RedirectURL'];
				} else {
					window.location.href = response['RedirectURL'];
				}

			}
		}
	})

});

}); //Document Ends


function zipcode_select() {
	$('.dropdown-menu a').click(function () {
		$(this).closest('.dropdown').find('input.select').val($(this).attr('data-value'));
	});
}

var AjaxGetCustomerProjects = (() => {
	var _ref = _asyncToGenerator(function* (CustomerUID) {
		return new Promise(function (resolve, reject) {
			resolve($.ajax({
				type: "POST",
				url: base_url + "CommonController/GetCustomerDetails",
				data: {
					"CustomerUID": CustomerUID
				},
				dataType: 'json',
				beforeSend: function () {
					addcardspinner('#Orderentrycard');
				}
			}));
		});
	});

	return function AjaxGetCustomerProjects(_x) {
		return _ref.apply(this, arguments);
	};
})();

var AjaxGetCustomerProducts = (() => {
	var _ref = _asyncToGenerator(function* (CustomerUID) {
		return new Promise(function (resolve, reject) {
			resolve($.ajax({
				type: "POST",
				url: base_url + "CommonController/Get_CustomerProducts",
				data: {
					"CustomerUID": CustomerUID
				},
				dataType: 'json',
				beforeSend: function () {
					addcardspinner('#Orderentrycard');
				}
			}));
		});
	});

	return function AjaxGetCustomerProducts(_x) {
		return _ref.apply(this, arguments);
	};
})();

var SendAsyncAjaxRequest = (() => {
	var _ref2 = _asyncToGenerator(function* (RequestType, ReqeustURL, RequestData, ResponseDataType, processData, contentType, BeforeSend_CallBack) {
		var ajaxoptions = {
			type: RequestType,
			url: base_url + ReqeustURL,
			data: RequestData,
			dataType: ResponseDataType,
			cache: false,
			beforeSend: BeforeSend_CallBack
		};

		if (processData == false) {
			ajaxoptions.processData = processData;
		}

		if (contentType == false) {
			ajaxoptions.contentType = contentType;
		}

		if (typeof this.processData === 'undefined') {
			this.processData = true;
		}
		if (typeof this.contentType === 'undefined') {
			this.contentType = true;
		}
		console.log(ajaxoptions);
		return new Promise(function (resolve, reject) {
			resolve($.ajax(ajaxoptions));
		});
	});

	return function SendAsyncAjaxRequest(_x2, _x3, _x4, _x5, _x6, _x7, _x8) {
		return _ref2.apply(this, arguments);
	};
})();

var TestSendAsyncAjaxRequest = (() => {
	var _ref3 = _asyncToGenerator(function* (RequestType, ReqeustURL, RequestData, ResponseDataType, processData, contentType, BeforeSend_CallBack) {
		var ajaxoptions = {
			type: RequestType,
			url: base_url + ReqeustURL,
			data: RequestData,
			dataType: ResponseDataType,
			cache: false,
			beforeSend: BeforeSend_CallBack
		};

		if (processData == false) {
			ajaxoptions.processData = processData;
		}

		if (contentType == false) {
			ajaxoptions.contentType = contentType;
		}

		if (typeof this.processData === 'undefined') {
			this.processData = true;
		}
		if (typeof this.contentType === 'undefined') {
			this.contentType = true;
		}
		console.log(ajaxoptions);
		return new Promise(function (resolve, reject) {
			$.ajax(ajaxoptions).done(function (data) {
				resolve(data);
			}).fail(function (error) {
				reject(error);
			});
		});
	});

	return function TestSendAsyncAjaxRequest(_x9, _x10, _x11, _x12, _x13, _x14, _x15) {
		return _ref3.apply(this, arguments);
	};
})();

var disposepopover = function (e) {
	$("[data-toggle=exception-popover]").popover('dispose');
	$("[data-toggle=clearexceptionpopover]").popover('dispose');
	$("[data-toggle=OnHold-popover]").popover('dispose');
	$("[data-toggle=Release-popover]").popover('dispose');
};

function check_is_url_contains_string_value(url) {
	// body...
	var substrings = ['Ordersummary', 'ThirdPartyTeam','FHA_VA_CaseTeam','TitleTeam','DocChase'],
	length = substrings.length;
	while (length--) {
		if (url.indexOf(substrings[length]) != -1) {
			// one of the substrings is in yourstring
			return true;
		}
	}
	return false;
}

function is_url_contains_string(word) {
	// body...
	var url = window.location.href;
	if (url.indexOf(word) != -1) {
		// one of the substrings is in yourstring
		return true;
	}
	return false;
}


var fn_review_complete = function (button, button_text) {
	var OrderUID = $('#OrderUID').val();

	$.ajax({
		type: "POST",
		url: base_url + 'OrderComplete/ReviewComplete',
		data: {
			'OrderUID': OrderUID
		},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			addcardspinner('#Orderentrycard');
		},
		success: function (data) {
			if (data.validation_error == 0) {

				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				if (check_is_url_contains_string_value(window.location.href)) {
					window.location.href = base_url + 'Revieworders';
				} else {
					triggerpage(base_url + 'Revieworders');
				}
			} else {
				swal({
					title: "<i class='icon-close2 icondanger'></i>",
					html: "<p>" + data.message + "</p>",
					confirmButtonClass: "btn btn-success",
					allowOutsideClick: false,
					width: '300px',
					buttonsStyling: false
				}).catch(swal.noop);
			}
			removecardspinner('#Orderentrycard');
			$(button).prop('disabled', false);
			$(button).html(button_text);
		},
		error: function (jqXHR) {
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to Complete</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
		}
	});
};

var fn_raise_exception = function (formdata, button, button_text) {
	var OrderUID = $('#OrderUID').val();

	$.ajax({
		type: "POST",
		url: base_url + 'OrderComplete/RaiseException',
		data: formdata,
		dataType: 'json',
		cache: false,
		processData: false,
		contentType: false,
		beforeSend: function () {
			button.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success: function (data) {
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();

				if (check_is_url_contains_string_value(window.location.href)) {
					window.location.reload();
				} else {
					triggerpage(window.location.href);
				}
			} else {
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 1000
				});
			}
			button.html(button_text);
			button.attr("disabled", false);
		},
		error: function (jqXHR) {
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to Complete</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
			button.html(button_text);
			button.attr("disabled", false);
		}
	});
};

var fn_clear_exception = function (formdata, button, button_text) {

	var OrderUID = $('#OrderUID').val();
	$.ajax({
		type: "POST",
		url: base_url + 'OrderComplete/ClearException',
		data: formdata,
		dataType: 'json',
		cache: false,
		processData: false,
		contentType: false,
		beforeSend: function () {
			// button.attr("disabled", true);
			// $submitbuttons.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success: function (data) {
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/

				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				if (check_is_url_contains_string_value(window.location.href)) {
					window.location.reload();
				} else {
					triggerpage(window.location.href);
				}
				$('#ClearException').modal('hide');
			} 
			else if(data.validation_error == 2){

				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 4000
				});

			}
			else {
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 1000
				});
			}
			button.html(button_text);
			$(button).prop('disabled', false);

			// button.attr("disabled", false);
			// $submitbuttons.attr("disabled", false);
		},
		error: function (jqXHR) {
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to Complete</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
		}
	});
};


var fn_raise_docchase = function (formdata, button, button_text) {
	var OrderUID = $('#OrderUID').val();

	$.ajax({
		type: "POST",
		url: base_url + 'OrderComplete/RaiseDocchase',
		data: formdata,
		dataType: 'json',
		cache: false,
		processData: false,
		contentType: false,
		beforeSend: function () {
			button.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success: function (data) {
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();

				if (check_is_url_contains_string_value(window.location.href)) {
					window.location.reload();
				} else {
					triggerpage(window.location.href);
				}
				$('#RaiseDocChase').modal('hide');
			} else {
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 1000
				});
				button.html(button_text);
				button.attr("disabled", false);
			}
		},
		error: function (jqXHR) {
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to Complete</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
			button.html(button_text);
			button.attr("disabled", false);
		}
	});
};

var fn_clear_docchase = function (formdata, button, button_text) {
	$('#completemultipledocchase_div').html('');

	var OrderUID = $('#OrderUID').val();
	$.ajax({
		type: "POST",
		url: base_url + 'OrderComplete/ClearDocChase',
		data: formdata,
		dataType: 'json',
		cache: false,
		processData: false,
		contentType: false,
		beforeSend: function () {
			// button.attr("disabled", true);
			// $submitbuttons.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success: function (data) {
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/

				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();

				triggerpage(base_url+'DocChase_Orders');
				$('#ClearDocChase').modal('hide');
				$('#completemultipledocchase_div').html('');
				$('#modal-completemultipledocchase').modal('hide');
			} 
			else if(data.validation_error == 2){
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 1000
				});
				button.html(button_text);
				$(button).prop('disabled', false);
				$('#ClearDocChase').modal('hide');
				$('#modal-completemultipledocchase').modal('show');
				$('#completemultipledocchase_div').html(data.html);

			}
			else {
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 1000
				});
				button.html(button_text);
				$(button).prop('disabled', false);
			}

			// button.attr("disabled", false);
			// $submitbuttons.attr("disabled", false);
		},
		error: function (jqXHR) {
			button.html(button_text);
			$(button).prop('disabled', false);
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to Complete</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
		}
	});
};

var fn_clear_multipledocchase = function (formdata, button, button_text) {

	var OrderUID = $('#OrderUID').val();
	$.ajax({
		type: "POST",
		url: base_url + 'OrderComplete/ClearMultipleDocChase',
		data: formdata,
		dataType: 'json',
		cache: false,
		processData: false,
		contentType: false,
		beforeSend: function () {
			// button.attr("disabled", true);
			// $submitbuttons.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success: function (data) {
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/

				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				triggerpage(base_url+'DocChase_Orders');
				$('#ClearDocChase').modal('hide');
				$('#completemultipledocchase_div').html('');
				$('#modal-completemultipledocchase').modal('hide');
			} 
			
			else {
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 1000
				});
				button.html(button_text);
				$(button).prop('disabled', false);
			}

			// button.attr("disabled", false);
			// $submitbuttons.attr("disabled", false);
		},
		error: function (jqXHR) {
			button.html(button_text);
			$(button).prop('disabled', false);
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to Complete</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
		}
	});
};


/*^^^^ Document CheckIn Complete Starts ^^^^^*/

$(document).off('click', '#DocumentCheckIncomplete').on("click", '#DocumentCheckIncomplete', function(e){

	e.preventDefault();
	var button = $(this);
	var button_text = $(this).html();

	/*SWEET ALERT CONFIRMATION*/
	swal({
		title: '<div class="text-primary" id="iconchg"><i style="font-size: 40px;" class="fa fa-info-circle fa-5x"></i></div>',
		html: '<span id="modal_msg" class= "modal_spanheading" > Do you want to complete Doc Check-In ?</span>',
		showCancelButton: true,
		confirmButtonClass: 'btn btn-success',
		cancelButtonClass: 'btn btn-danger',
		buttonsStyling: false,
		closeOnClickOutside: false,
		allowOutsideClick: false,
		showLoaderOnConfirm: true,
		position: 'bottom-middle'
	}).then(function (confirm) {	
		$('a[data-dismiss="alert"]').trigger('click');
		var OrderUID = $('#OrderUID').val();

		$.ajax({
			type: "POST",
			url: base_url+'OrderComplete/DocumentCheckInComplete',
			data: {
				'OrderUID': OrderUID
			},
			dataType: 'json',
			cache: false,
			beforeSend: function () {
				addcardspinner('#Orderentrycard');
				$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing...');
				$(button).prop('disabled', true);

			},
			success: function(data)
			{
				if (data.validation_error == 0) {
					/*Sweet Alert MSG*/
					$.notify({
						icon: "icon-bell-check",
						message: data['message']
					}, {
						type: "success",
						delay: 1000
					});
					disposepopover();
					if (check_is_url_contains_string_value(window.location.href)) {
						window.location.href = base_url + 'DocumentCheckInOrders';
					} else {
						triggerpage(base_url + 'DocumentCheckInOrders');
					}
				} else {
					swal({

						text: "<p>" + data.message + "</p>",
						type: 'warning',
						confirmButtonText: 'Ok',
						confirmButtonClass: "btn btn-success",
						timer: 3000,
						buttonsStyling: false
					}).catch(swal.noop);
				}
				$(button).prop('disabled', false);
				$(button).html(button_text);
			}
		})
		.always(function () {
			$(button).html(button_text);
			$(button).prop('disabled', false);

		});

	}, function (dismiss) {
		swal({
			title: 'Cancelled',
			timer: 1000,
			type: 'error',
			confirmButtonClass: "btn btn-info",
			buttonsStyling: false
		}).catch(swal.noop);
	});
});
/*^^^^ Document CheckIn Complete Ends ^^^^^*/


function SwalConfirmExport(OrderUID, OrderNumber, currentrow, table, LoanNumber) {

	swal({
		title: 'Export Document',
		html:
		`
		<div class="text-left ml-20" style="font-size:16px;">
		<div class="form-check">
		<label class="form-check-label">
		<input id="export1" type="checkbox" class="form-check-input exportformat" value="1" checked> Export as Single PDF
		<span class="form-check-sign">
		<span class="check"></span>
		</span>
		</label>
		</div>` +
		`<div class="form-check">
		<label class="form-check-label">
		<input id="export2" type="checkbox" class="form-check-input exportformat" value="2"> Export as Zip
		<span class="form-check-sign">
		<span class="check"></span>
		</span>
		</label>
		</div>
		</div>`,
		showCancelButton: true,
		confirmButtonClass: "btn btn-success",
		cancelButtonClass: "btn btn-danger",
		confirmButtonText: "Export",
		cancelButtonText: "cancel please!",
		closeOnConfirm: false,
		closeOnCancel: true,
		showLoaderOnConfirm: true,
		buttonsStyling: false,
		preConfirm: function () {
			return new Promise(function (resolve, reject) {
				
				if ($('#export1').prop('checked') || $('#export2').prop('checked')) {

					var responseobj = {
						"SinglePDF": $('#export1').prop('checked'),
						"ZipFile": $('#export2').prop('checked')
					};
					var fn_array = []
					if (responseobj.SinglePDF) {
						fn_array[0] = ExportPDF(OrderUID, OrderNumber, LoanNumber);

					}
					if (responseobj.ZipFile) {
						fn_array[1] = ExportZip(OrderUID, OrderNumber,LoanNumber);
					}
					Promise.race(fn_array).then(function (response) {
						resolve("success");
						if (location.href == base_url+'Export') {
							triggerpage(base_url+'Export');
						}
						// table
						// 	.row(currentrow)
						// 	.remove()
						// 	.draw();
					})

				}
				else {
					reject('Nothing Choosen');
				}
			})
		},
		onOpen: function () {
			$('#export1').focus()
		}
	}).then(function (result) {
		// swal(JSON.stringify(result))
	}).catch(swal.noop)

}

function ExportPDF(OrderUID, OrderNumber, LoanNumber) {


	return new Promise(function (resolve, reject) {

		var clickable_link = document.createElement('a');
		clickable_link.href = base_url + 'Indexing/DownloadPDF/' + OrderUID;
		clickable_link.target = '_blank';
		clickable_link.download = (LoanNumber ? LoanNumber : OrderNumber) + "_Export.pdf";
		clickable_link.click();
		resolve('Success');

		/*^^^^^ OR USE Below ^^^^*/
	})

}

function ExportZip(OrderUID, OrderNumber,LoanNumber) {

	return new Promise(function (resolve, reject) {

		var clickable_link = document.createElement('a');
		clickable_link.href = base_url + 'Indexing/DownloadZip/' + OrderUID;
		clickable_link.target = '_blank';
		clickable_link.download = (LoanNumber ? LoanNumber : OrderNumber) + "_Export.zip";
		clickable_link.click();
		resolve('Success');
	})

}



function toArray() {
	var pages = $('ol.sortable .leaf');
	var JSONArray = [];
	$(pages).each(function (key, elem) {
		var dataobject = {};


		var documenttype = findParentElement($(elem)[0], 'li');
		var category = findParentElement($(documenttype)[0], 'li');


		dataobject.CategoryName = $(category).attr('data-category');
		dataobject.DocumentTypeName = $(documenttype).attr('data-documenttype');
		dataobject.Page = $(elem).attr('data-category');
		JSONArray.push(dataobject);
	})

	console.table(JSONArray);
	return JSONArray;
}


function findParentElement(elem, tagName) {
	var parent = elem.parentNode;

	if (parent && parent.tagName && parent.tagName.toLowerCase() != tagName) {
		parent = findParentElement(parent, tagName);
	}
	return parent;
}
$(document).off('click','#OrderRevokeBtn').on('click','#OrderRevokeBtn',function(e){
	var OrderUID =$('#OrderUID').val();
	swal({
		title: 'Are you sure?',
		text: "You won't be able to revoke this!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonClass: 'btn btn-success',
		cancelButtonClass: 'btn btn-danger',
		confirmButtonText: 'Yes',
		buttonsStyling: false
	}).then(function() {
		swal({
			title: 'Revoked!',
			text: 'Your order has been Revoked.',
			type: 'success',
			confirmButtonClass: "btn btn-success",
			buttonsStyling: false

		})
		$.ajax({
			type :"POST",
			url : base_url+'CommonController/CancelOrderRevoke',
			data :{OrderUID:OrderUID},
			dataType:"json",
			beforeSend: function () {
			},
			success: function(response){
				if(response.validation_error == 1)
				{
					$.notify(
					{
						icon:"icon-bell-check",
						message:response.message
					},
					{
						type:"success",
						delay:1000 
					});
				}
				setTimeout(function(){ 

					if (check_is_url_contains_string_value(window.location.href)) {
						window.location.reload();
					} else {
						triggerpage(window.location.href);
					}

				}, 2000);
			}
		});
	}).catch(swal.noop);
});

$(document).off('click', '#BtnOnHold').on('click', '#BtnOnHold', function (e) {

	e.preventDefault();
	e.stopPropagation();
	var OrderUID = $('#OrderUID').val();
	var comments = $('.remarkstext:visible').val();
	var CustomerNotification = $('#CustomerNotification:checked').val();
	var UserEmails = $('.UserEmails').eq(1).val();
		// var Onholdtype =$('.Onholdtype option:selected').eq(1).val();

		if(comments == ''){
			$('.remarkstext').addClass('highlight-invalid');
			$.notify(
			{
				icon:"icon-bell-check",
				message:'Remarks Mandatory',
			},
			{
				type:"danger",
				delay:1000 
			});
			return false;
		}

		if(CustomerNotification == 'on'){
			if(UserEmails == '' ||  UserEmails =='[]'){
				$.notify(
				{
					icon:"icon-bell-check",
					message:'Enter Valid Email',
				},
				{
					type:"info",
					delay:1000 
				});
				return false;
			}
		}	
		

		var button = $('.BtnOnHold');
		var button_text = $('.BtnOnHold').html();

		$(button).prop('disabled', true);
		$(button).html('<i class="fa fa-spin fa-spinner"></i> ...OnHolding');

		// var formdata = new FormData($(this)[0]);
		// formdata.append('OrderUID', OrderUID);
		// formdata.append('CustomerEmail', CustomerEmail);

		$.ajax({
			type: "POST",
			url: base_url + 'OrderComplete/OrderOnHold',
			data: {OrderUID:OrderUID,comments:comments,CustomerNotification:CustomerNotification,UserEmails:UserEmails},
			dataType: 'json',
			cache: false,
			// processData: false,
			// contentType: false,
			beforeSend: function () {
				button.attr("disabled", true);
				button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
			},
			success:function(response){
				console.log(response);
				if (response.validation_error == 1) {
					{
						$.notify(
						{
							icon:"icon-bell-check",
							message:response.message
						},
						{
							type:"success",
							delay:1000 
						});
					}
				}
				disposepopover();
				setTimeout(function(){ 

					location.reload();

				}, 500);


			}

			
		})
	});

$(document).off('click','#BtnReleaseOnHold').on('click','#BtnReleaseOnHold',function(e){
	var OrderUID =$('#OrderUID').val();
	var OnHoldUID =$('#OnHoldUID').val();

	var button = $('.BtnReleaseOnHold');
	var button_text = $('.BtnReleaseOnHold').html();

	var comments = $('.comments_text:visible').val();
	

	if(comments == ''){
		$('.comments_text').addClass('highlight-invalid');
		$.notify(
		{
			icon:"icon-bell-check",
			message:'Comments Mandatory',
		},
		{
			type:"danger",
			delay:1000 
		});
		return false;
	}

	

	$.ajax({
		type: "POST",
		url: base_url + 'OrderComplete/ReleaseOnHold',
		data: {OrderUID:OrderUID,OnHoldUID:OnHoldUID,comments:comments},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			button.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success:function(response){
			console.log(response);
			if (response.validation_error == 1) {
				{
					$.notify(
					{
						icon:"icon-bell-check",
						message:response.message
					},
					{
						type:"success",
						delay:1000 
					});
				}
			}
			disposepopover();
			setTimeout(function(){ 

				location.reload();

			}, 500);


		}


	})


});


/*######## Orderentry and ordersummary form submit starts #########*/


/*For single entry*/

$(document).off('click','.single_submit').on('click','.single_submit',function(e){
	OrderEntryBtnID = $(this).attr('id'); 
});


$(document).off('submit', '#order_frm').on('submit', '#order_frm', function(event) {
	/* Act on the event */
	event.preventDefault();
	event.stopPropagation();
	button = $(".single_submit[clicked=true]");
	button_val = $(".single_submit[clicked=true]").val();
	button_text = $(".single_submit[clicked=true]").html();

	var progress=$('#orderentry-progressupload .progress-bar');


	var formData = new FormData($(this)[0]);
// console.log(formData); exit;
	$.ajax({
		type: "POST",
		url: base_url + 'Orderentry/insert',
		data: formData, 
		dataType:'json',
		cache: false,
		processData:false,
		contentType:false,
		beforeSend: function(){
			addcardspinner('#Orderentrycard');
			button.attr("disabled", true);
			button.html('Loading ...'); 
		},
		success: function(data)
		{
			if(data['validation_error'] == 0){
// removecardspinner('#Orderentrycard');
				$.notify({icon:"icon-bell-check",message:data['message']},{type:"success",delay:3000 });

				if (OrderEntryBtnID == 'saveandnew') {
								// alert(OrderEntryBtnID);
								var myVar = setInterval(myTimer, 1000);
								function myTimer() {
								triggerpage(base_url + "Orderentry");
							} }
							else{
								var myVar = setInterval(myTimer, 1000);
								function myTimer() {
								triggerpage(base_url + "Dashboard");
							} }

						}else if(data['validation_error'] == 1){

							removecardspinner('#Orderentrycard');

							$.notify({icon:"icon-bell-check",message:data['message']},{type:"danger",delay:1000 });

							button.html(button_text);
							button.removeAttr("disabled");


							$.each(data, function(k, v) {
								$('#'+k).addClass("is-invalid").closest('.form-group').removeClass('has-success').addClass('has-danger');
								$('#'+ k +'.select2picker').next().find('span.select2-selection').addClass('errordisplay');

							});
						}else if(data['validation_error'] == 2){
							removecardspinner('#Orderentrycard');
							$('#duplicate-modal').modal('show');
							$('#Skip_duplicate').val(1);
							$('#button_value').val(button_val);
							$('#insert_html').html(data['html']);	
							$('#insert_order').removeAttr('disabled');									
						}

						
					},
					error: function (jqXHR, textStatus, errorThrown) {

						console.log(errorThrown);

					},
					failure: function (jqXHR, textStatus, errorThrown) {

						console.log(errorThrown);

					},
				});
});



/*For ordersummary*/
$(document).off('submit', '#frmordersummary').on('submit', '#frmordersummary', function(event) {
	/* Act on the event */
	event.preventDefault();
	event.stopPropagation();
	button = $(".checklist_update");
	button_val = $(".checklist_update").val();
	button_text = $(".checklist_update").html();
	var OrderUID = $('#OrderUID').val();		
	var progress=$('.progress-bar');
	$('#DocumentUpload').val('');
	var formData = new FormData($(this)[0]);
	frmSubmit(formData, button, progress, OrderUID, button_text);
});


function frmSubmit(formData, button, progress, OrderUID, button_text) {

	var init_url = window.location.href;
	$.ajax({
		type: "POST",
		url: base_url + 'Ordersummary/insert',
		data: formData, 
		dataType:'json',
		cache: false,
		processData:false,
		contentType:false,
		beforeSend: function(){
			addcardspinner('#Orderentrycard');
			button.attr("disabled", true);
			button.html('Loading ...'); 
			
		},
		success: function(data)
		{
			if(data['validation_error'] == 0){

				$.notify({icon:"icon-bell-check",message:data['message']},{type:"success",delay:3000 });

				removecardspinner('#Orderentrycard');

				$("#orderentry-progressupload").hide();

				var aFileSubmit = [];
				var files = [];
				var respOrderUIDs = data['id'];

				Promise.all(aFileSubmit).then(function (response) {
					setTimeout(function(){ 
						window.location.reload();
					}, 3000);


				});


			}else if(data['validation_error'] == 1){

				removecardspinner('#Orderentrycard');

				$.notify({icon:"icon-bell-check",message:data['message']},{type:"danger",delay:1000 });



				$.each(data, function(k, v) {
					$('#'+k).addClass("is-invalid").closest('.form-group').removeClass('has-success').addClass('has-danger');
					$('#'+ k +'.select2picker').next().find('span.select2-selection').addClass('errordisplay');

				});
			}


		},
		error: function (jqXHR, textStatus, errorThrown) {

			console.log(errorThrown);

		},
		failure: function (jqXHR, textStatus, errorThrown) {

			console.log(errorThrown);

		},
	})
	.always(function() {		
		button.html(button_text);
		button.removeAttr("disabled");
	});


}

/*######## Orderentry and ordersummary form submit ends #########*/




/*######## Single Order Entry File UPload ajax starts #####*/

function SendFileAsync(formdata, filename) {

	return new Promise(function (resolve, reject) {

		if($('#uploadPane-Card').hasClass('hide'))
		{
			$('#uploadPane-Card').removeClass('hide');
		}
		hash = Date.now();
		li_element = '<li data-hash="'+ hash +'" style="list-style-type: none;"><span class="up_status fa fa-spin fa-spinner" aria-hidden="true"></span> '+filename+'<span class="filesize pull-right" data-filename="'+filename+'"><span hash="'+ hash +'" class="pma_drop_file_status" task="info"><span class="underline">Uploading...</span></span></span><br><progress max="100" value="10"></progress><span class="upload-percent"></span></li>';

		$('#uploadPane-CardBody').append(li_element);
		var progress = $('#uploadPane-CardBody').find('[data-hash="'+ hash +'"]');
		$.ajax({
			url: base_url + 'Orderentry/uploadfile',
			type: 'POST',
			dataType: 'json',
			data: formdata,
			contentType: false,
			processData: false,
			beforeSend: function () {
				console.log("send");
			},
			xhr: function () {
				xhr = new window.XMLHttpRequest();

				xhr.upload.addEventListener("progress", function (evt) {
					if (evt.lengthComputable) {

						var percentComplete = evt.loaded / evt.total;
						percentComplete = parseInt(percentComplete * 100);
						console.log(percentComplete);
						$(progress).find('progress').val(percentComplete);
						$(progress).find('.upload-percent').html(percentComplete + '%')
					}
				}, false);
				return xhr;

			}
		})
		.done(function(response) {
			$(progress).find('.underline').html('Success');
			$(progress).find('.up_status').removeClass('fa-spin');
			$(progress).find('.up_status').removeClass('fa-spinner');
			$(progress).find('.up_status').addClass('fa-check');
			$(progress).find('.up_status').addClass('text-success');
			$(progress).find('progress').hide();
			$(progress).find('.upload-percent').hide();
			resolve('Success');
			console.log("success");
		})
		.fail(function(jqXHR) {
			$(progress).find('.underline').html('Failed');
			$(progress).find('.up_status').removeClass('fa-spin');
			$(progress).find('.up_status').removeClass('fa-spinner');
			$(progress).find('.up_status').addClass('fa-exclamation-circle');
			$(progress).find('.up_status').addClass('text-danger');
			$(progress).find('progress').hide();
			$(progress).find('.upload-percent').hide();

			console.log(jqXHR);
			reject("error");
		})
		.always(function() {
			$(progress).find('progress').hide();
			console.log("complete");
		});

	});
}
/*######## Single Order Entry File UPload ajax ends #####*/


	// Raise Follow up for document missing orders in bulk entry.
	function RaiseFollowForOrders(_Orders) {
		
		return new Promise(function (resolve, reject) {

			$.ajax({
				url: 'Orderentry/RaiseFollowUp',
				type: 'POST',
				dataType: 'json',
				data: {'Orders':_Orders},
			})
			.done(function(response) {
				if (response.validation_error == 0) {
					console.log("Follow Up Raised Successfully");
				}
				else{
					console.log("Unable to Raise Follow Up");	
				}
			})
			.fail(function() {
				console.log("Error", "Unable to Raise Follow Up");	
			})
			.always(function() {
				console.log("complete");
			});
		});

		
	}

	function MergeFilesLater() {
		
		return new Promise(function (resolve, reject) {

			$.ajax({
				url: 'Orderentry/MergeFilesLater',
				type: 'POST',
				dataType: 'json',
			})
			.done(function(response) {
				if (response.success == 0) {
					console.log(response.messge);
				}
				else{
					console.log(response.messge);	
				}
			})
			.fail(function(jqXHR) {
				console.log("Error", "Unable to Raise Follow Up");	
				console.log(jqXHR);
			})
			.always(function() {
				console.log("complete");
			});
		});

	}


	function Fetch_Product_DocType(object) {

		$.ajax({
			type: "POST",
			url: base_url + "CommonController/GetCustomerSubProducts",
			data: object,
			dataType: 'json',
			beforeSend: function () {
				addcardspinner('#Orderentrycard');
			},

			success: function (response) {

				var ProjectCustomer = response.ProjectCustomer;

				Project_select = ProjectCustomer.reduce((accumulator, value) => {
					return accumulator + '<Option value="' + value.ProjectUID + '">' + value.ProjectName + '</Option>';
				}, '');


				$('#Single-ProjectUID').html(Project_select);

				$('#Single-ProjectUID').val($('#Single-ProjectUID').find('option:first').val()).trigger('change');

				callselect2();
				removecardspinner('#Orderentrycard');
			}
		});

	}
	//make followup start
	$(document).off('click','#BtnFollowup').on('click','#BtnFollowup',function(e)
	{

		e.preventDefault();
		var OrderUID = $('#OrderUID').val();
		var comments = $('.popover').find('.comments').val();
		button = $(this);
		button_val = $(this).val();
		button_text = $(this).html();
		$(this).attr("disabled", true);
		$.ajax({
			type: "POST",
			url: base_url + "Followup/audit_faild_followup",
			data: {
				"OrderUID": OrderUID,"comments" : comments	},
				success : function(data)
				{
					
					if (data.validation_error == 0) 
					{

						button.html('Submit'); 
						button.removeAttr('disabled');
						disposepopover();
						jQuery('.close').trigger('click');

						swal({
							title: 'Success',
							text: "Followup Started",
							type: 'success',
							timer: 5000,
							confirmButtonText: 'ok',

						});
						window.location = base_url+'Followup';

					}
					else
					{
						swal({
							title: "<i class='icon-close2 icondanger'></i>",
							html: "<p>" + data.message + "</p>",
							confirmButtonClass: "btn btn-success",
							allowOutsideClick: false,
							width: '300px',
							buttonsStyling: false
						}).catch(swal.noop);						
					}
					button.html(button_text);
					button.attr("disabled", false);

				},
				error: function (jqXHR) {
					swal({
						title: "<i class='icon-close2 icondanger'></i>",
						html: "<p>Failed to Complete</p>",
						confirmButtonClass: "btn btn-success",
						allowOutsideClick: false,
						width: '300px',
						buttonsStyling: false
					}).catch(swal.noop);
					button.html(button_text);
					button.attr("disabled", false);
				}
			});
	});

//followup complete button click event

$(document).off('click','#BtnFollowupComplete').on('click','#BtnFollowupComplete',function(e)
{

	e.preventDefault();
	var OrderUID = $('#OrderUID').val();
	var Followuptype = $('.popover').find('.Followuptype').children("option:selected").val();
	var comments = $('.popover').find('.completecomments').val();
	$(this).attr("disabled", true);
	$.ajax({
		type: "POST",
		url: base_url + "Followup/CompleteFollowup",
		data: {
			"OrderUID": OrderUID,"Followuptype" :Followuptype,"Comments":comments},
			success : function(data)
			{
				if(data == 1)
				{
					swal({
						title: 'Success',
						text: "Followup Completed",
						type: 'success',
						timer: 5000,
						confirmButtonText: 'ok',

					});
					window.location = base_url+'DocumentCheckInOrders';




				}
				else
				{
					swal({
						title: 'Failed',
						text: "Followup Not Completed",
						type: 'error',
						timer: 1000,
					});
				}
			}
		});
});


// Check is hex color

function isColor(strColor){
	var regex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
	if(regex.test(strColor)){
		return true;
	}
	return false;
}


//prescreen assign and workflow complete
Checked_Workflows = [];
$(document).off('click', '#btnprescreenassign').on("click", '#btnprescreenassign', function(e){

	e.preventDefault();
	var button = $(this);
	var button_text = $(this).html();

	var OrderUID = $('#OrderUID').val();
	$("input:checkbox[name=WorkflowModuleUIDToAssign]:checked").each(function(){
		Checked_Workflows.push($(this).val());
	});
	var formData = new FormData($("#frmordersummary")[0]);
	AutoUpdate(formData);
	$.ajax({
		type: "POST",
		url: base_url+'OrderComplete/PreScreenassign_complete',
		data: {
			'OrderUID': OrderUID,
			'Checked_Workflows': Checked_Workflows
		},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			addcardspinner('#Orderentrycard');
			$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing...');
			$(button).prop('disabled', true);

		},
		success: function(data)
		{
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				$('#modal-OrderAssign').modal('hide');
				disposepopover();
				swal({
					text: "REDIRECT TO PRE-SCREEN LIST?",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, Redirect!',
					cancelButtonText: 'No, Stay here',
					confirmButtonClass: "btn btn-success",
					cancelButtonClass: "btn btn-info",
					buttonsStyling: false
				}).then(function() {
					triggerpage(base_url+'PreScreen_Orders')
				}, function(dismiss){
					triggerpage(window.location.href);
				});
			} else {
				swal({

					text: "<p>" + data.message + "</p>",
					type: 'warning',
					confirmButtonText: 'Ok',
					confirmButtonClass: "btn btn-success",
					timer: 3000,
					buttonsStyling: false
				}).catch(swal.noop);
			}
			$(button).prop('disabled', false);
			$(button).html(button_text);
		}
	})
	.always(function () {
		$(button).html(button_text);
		$(button).prop('disabled', false);

	});


});

$(document).off('click', '#welcomecallComplete').on("click", '#welcomecallComplete', function(e){

	e.preventDefault();
	var button = $(this);
	var button_text = $(this).html();

	var OrderUID = $('#OrderUID').val();
	var formData = new FormData($("#frmordersummary")[0]);
	AutoUpdate(formData);
	$.ajax({
		type: "POST",
		url: base_url+'OrderComplete/welcomecall_complete',
		data: {
			'OrderUID': OrderUID
		},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			addcardspinner('#Orderentrycard');
			$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing...');
			$(button).prop('disabled', true);

		},
		success: function(data)
		{
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				swal({
					text: "REDIRECT TO WELCOME CALL LIST?",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, Redirect!',
					cancelButtonText: 'No, Stay here',
					confirmButtonClass: "btn btn-success",
					cancelButtonClass: "btn btn-info",
					buttonsStyling: false
				}).then(function() {
					triggerpage(base_url+'WelcomeCall_Orders')
				}, function(dismiss){
					triggerpage(window.location.href);
				});
			} else {
				swal({

					text: "<p>" + data.message + "</p>",
					type: 'warning',
					confirmButtonText: 'Ok',
					confirmButtonClass: "btn btn-success",
					timer: 3000,
					buttonsStyling: false
				}).catch(swal.noop);
			}
			$(button).prop('disabled', false);
			$(button).html(button_text);
		}
	})
	.always(function () {
		$(button).html(button_text);
		$(button).prop('disabled', false);

	});


});


$(document).off('click', '#titleteamComplete').on("click", '#titleteamComplete', function(e){

	e.preventDefault();
	var button = $(this);
	var button_text = $(this).html();

	var OrderUID = $('#OrderUID').val();
	var formData = new FormData($("#frmordersummary")[0]);
	AutoUpdate(formData);
	$.ajax({
		type: "POST",
		url: base_url+'OrderComplete/titleteamComplete',
		data: {
			'OrderUID': OrderUID
		},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			addcardspinner('#Orderentrycard');
			$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing...');
			$(button).prop('disabled', true);

		},
		success: function(data)
		{
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				swal({
					text: "REDIRECT TO TITLE LIST?",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, Redirect!',
					cancelButtonText: 'No, Stay here',
					confirmButtonClass: "btn btn-success",
					cancelButtonClass: "btn btn-info",
					buttonsStyling: false
				}).then(function() {
					triggerpage(base_url+'TitleTeam_Orders')
				}, function(dismiss){
					triggerpage(window.location.href);
				});
			} else {
				swal({

					text: "<p>" + data.message + "</p>",
					type: 'warning',
					confirmButtonText: 'Ok',
					confirmButtonClass: "btn btn-success",
					timer: 3000,
					buttonsStyling: false
				}).catch(swal.noop);
			}
			$(button).prop('disabled', false);
			$(button).html(button_text);
		}
	})
	.always(function () {
		$(button).html(button_text);
		$(button).prop('disabled', false);

	});


});

$(document).off('click', '#fhavacaseteamComplete').on("click", '#fhavacaseteamComplete', function(e){
	e.preventDefault();
	var button = $(this);
	var button_text = $(this).html();

	var OrderUID = $('#OrderUID').val();
	var formData = new FormData($("#frmordersummary")[0]);
	AutoUpdate(formData);
	$.ajax({
		type: "POST",
		url: base_url+'OrderComplete/fhavacaseteamComplete',
		data: {
			'OrderUID': OrderUID
		},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			addcardspinner('#Orderentrycard');
			$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing...');
			$(button).prop('disabled', true);

		},
		success: function(data)
		{
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				swal({
					text: "REDIRECT TO FHA/VA LIST?",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, Redirect!',
					cancelButtonText: 'No, Stay here',
					confirmButtonClass: "btn btn-success",
					cancelButtonClass: "btn btn-info",
					buttonsStyling: false
				}).then(function() {
					triggerpage(base_url+'FHAVACaseTeam_Orders')
				}, function(dismiss){
					triggerpage(window.location.href);
				});
			} else {
				swal({

					text: "<p>" + data.message + "</p>",
					type: 'warning',
					confirmButtonText: 'Ok',
					confirmButtonClass: "btn btn-success",
					timer: 3000,
					buttonsStyling: false
				}).catch(swal.noop);
			}
			$(button).prop('disabled', false);
			$(button).html(button_text);
		}
	})
	.always(function () {
		$(button).html(button_text);
		$(button).prop('disabled', false);

	});


});

$(document).off('click', '#thirdpartyteamComplete').on("click", '#thirdpartyteamComplete', function(e){
	e.preventDefault();
	var button = $(this);
	var button_text = $(this).html();

	var OrderUID = $('#OrderUID').val();
	var formData = new FormData($("#frmordersummary")[0]);
	AutoUpdate(formData);
	$.ajax({
		type: "POST",
		url: base_url+'OrderComplete/thirdpartyteamComplete',
		data: {
			'OrderUID': OrderUID
		},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			addcardspinner('#Orderentrycard');
			$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing...');
			$(button).prop('disabled', true);

		},
		success: function(data)
		{
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				swal({
					text: "REDIRECT TO THIRD PARTY LIST?",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, Redirect!',
					cancelButtonText: 'No, Stay here',
					confirmButtonClass: "btn btn-success",
					cancelButtonClass: "btn btn-info",
					buttonsStyling: false
				}).then(function() {
					triggerpage(base_url+'ThirdParty_Orders')
				}, function(dismiss){
					triggerpage(window.location.href);
				});
			} else {
				swal({

					text: "<p>" + data.message + "</p>",
					type: 'warning',
					confirmButtonText: 'Ok',
					confirmButtonClass: "btn btn-success",
					timer: 3000,
					buttonsStyling: false
				}).catch(swal.noop);
			}
			$(button).prop('disabled', false);
			$(button).html(button_text);
		}
	})
	.always(function () {
		$(button).html(button_text);
		$(button).prop('disabled', false);

	});


});


$(document).off('click', '#workupcomplete').on("click", '#workupcomplete', function(e){
	e.preventDefault();
	var button = $(this);
	var button_text = $(this).html();

	var OrderUID = $('#OrderUID').val();
	$.ajax({
		type: "POST",
		url: base_url+'OrderComplete/workupcomplete',
		data: {
			'OrderUID': OrderUID
		},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			addcardspinner('#Orderentrycard');
			$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing...');
			$(button).prop('disabled', true);

		},
		success: function(data)
		{
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				swal({
					text: "REDIRECT TO WORKUP LIST?",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, Redirect!',
					cancelButtonText: 'No, Stay here',
					confirmButtonClass: "btn btn-success",
					cancelButtonClass: "btn btn-info",
					buttonsStyling: false
				}).then(function() {
					triggerpage(base_url+'WorkUp_Orders')
				}, function(dismiss){
					triggerpage(window.location.href);
				});
			} else {
				swal({

					text: "<p>" + data.message + "</p>",
					type: 'warning',
					confirmButtonText: 'Ok',
					confirmButtonClass: "btn btn-success",
					timer: 3000,
					buttonsStyling: false
				}).catch(swal.noop);
			}
			$(button).prop('disabled', false);
			$(button).html(button_text);
		}
	})
	.always(function () {
		$(button).html(button_text);
		$(button).prop('disabled', false);

	});


});
$(document).off('click', '#underwritercomplete').on("click", '#underwritercomplete', function(e){
	e.preventDefault();
	var button = $(this);
	var button_text = $(this).html();

	var OrderUID = $('#OrderUID').val();
	$.ajax({
		type: "POST",
		url: base_url+'OrderComplete/underwritercomplete',
		data: {
			'OrderUID': OrderUID
		},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			addcardspinner('#Orderentrycard');
			$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing...');
			$(button).prop('disabled', true);

		},
		success: function(data)
		{
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				swal({
					text: "REDIRECT TO UNDERWRITER LIST?",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, Redirect!',
					cancelButtonText: 'No, Stay here',
					confirmButtonClass: "btn btn-success",
					cancelButtonClass: "btn btn-info",
					buttonsStyling: false
				}).then(function() {
					triggerpage(base_url+'UnderWriter_Orders')
				}, function(dismiss){
					triggerpage(window.location.href);
				});
			} else {
				swal({

					text: "<p>" + data.message + "</p>",
					type: 'warning',
					confirmButtonText: 'Ok',
					confirmButtonClass: "btn btn-success",
					timer: 3000,
					buttonsStyling: false
				}).catch(swal.noop);
			}
			$(button).prop('disabled', false);
			$(button).html(button_text);
		}
	})
	.always(function () {
		$(button).html(button_text);
		$(button).prop('disabled', false);

	});


});
$(document).off('click', '#schedulingcomplete').on("click", '#schedulingcomplete', function(e){
	e.preventDefault();
	var button = $(this);
	var button_text = $(this).html();

	var OrderUID = $('#OrderUID').val();
	$.ajax({
		type: "POST",
		url: base_url+'OrderComplete/schedulingcomplete',
		data: {
			'OrderUID': OrderUID
		},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			addcardspinner('#Orderentrycard');
			$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing...');
			$(button).prop('disabled', true);

		},
		success: function(data)
		{
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				swal({
					text: "REDIRECT TO SCHEDULING LIST?",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, Redirect!',
					cancelButtonText: 'No, Stay here',
					confirmButtonClass: "btn btn-success",
					cancelButtonClass: "btn btn-info",
					buttonsStyling: false
				}).then(function() {
					triggerpage(base_url+'Scheduling_Orders')
				}, function(dismiss){
					triggerpage(window.location.href);
				});
			} else {
				swal({

					text: "<p>" + data.message + "</p>",
					type: 'warning',
					confirmButtonText: 'Ok',
					confirmButtonClass: "btn btn-success",
					timer: 3000,
					buttonsStyling: false
				}).catch(swal.noop);
			}
			$(button).prop('disabled', false);
			$(button).html(button_text);
		}
	})
	.always(function () {
		$(button).html(button_text);
		$(button).prop('disabled', false);

	});


});
$(document).off('click', '#closingcomplete').on("click", '#closingcomplete', function(e){
	e.preventDefault();
	var button = $(this);
	var button_text = $(this).html();

	var OrderUID = $('#OrderUID').val();
	$.ajax({
		type: "POST",
		url: base_url+'OrderComplete/closingcomplete',
		data: {
			'OrderUID': OrderUID
		},
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			addcardspinner('#Orderentrycard');
			$(button).html('<i class="fa fa-spin fa-spinner"></i> Completing...');
			$(button).prop('disabled', true);

		},
		success: function(data)
		{
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				swal({
					text: "REDIRECT TO CLOSING LIST?",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, Redirect!',
					cancelButtonText: 'No, Stay here',
					confirmButtonClass: "btn btn-success",
					cancelButtonClass: "btn btn-info",
					buttonsStyling: false
				}).then(function() {
					triggerpage(base_url+'Closing_Orders')
				}, function(dismiss){
					triggerpage(window.location.href);
				});

			} else {
				swal({

					text: "<p>" + data.message + "</p>",
					type: 'warning',
					confirmButtonText: 'Ok',
					confirmButtonClass: "btn btn-success",
					timer: 3000,
					buttonsStyling: false
				}).catch(swal.noop);
			}
			$(button).prop('disabled', false);
			$(button).html(button_text);
		}
	})
	.always(function () {
		$(button).html(button_text);
		$(button).prop('disabled', false);

	});


});


$(document).off('click','.PickNewOrder').on('click','.PickNewOrder',function(){

	var OrderUID = $(this).attr('data-orderuid');

	var WorkflowModuleUID = $(this).attr('data-WorkflowModuleUID');


	$.ajax({
		url: 'CommonController/PickExistingOrderCheck',
		type: 'POST',
		dataType: 'json',
		data: {OrderUID: OrderUID, WorkflowModuleUID: WorkflowModuleUID},
		beforeSend: function(){

		},
	})
	.done(function(response) {
		
		if(response.validation_error == 2)
		{
			$.notify(
			{
				icon:"icon-bell-check",
				message:response.message
			},
			{
				type:response.color,
				delay:1000 
			});

			setTimeout(function(){ 

				triggerpage('Ordersummary/index/'+OrderUID);

			}, 3000);

		}else if(response.validation_error == 1){
			$('.AssignmentName').html(response.message.UserName);
			$('.btnChangeOrderAssignment').attr('data-OrderAssignmentUID',response.message.OrderAssignmentUID);
 			$('#ChangeOrderAssignment').modal('show');

		}

	})
	.fail(function(jqXHR) {
		console.error("error", jqXHR);
		$.notify(
		{
			icon:"icon-bell-check",
			message:"unable to assign"
		},
		{
			type:"danger",
			delay:1000 
		});
	})
	.always(function() {
		console.log("complete");
	});

});


$(document).off('click', '.btncleardocchase').on('click', '.btncleardocchase', function (e) {
	btncleardocchase_value = $(this).val();
	$button = $(this);
});

$(document).off('click', '.btnmultiplecleardocchase').on('click', '.btnmultiplecleardocchase', function (e) {
	btnmultiplecleardocchase_value = $(this).val();
	$btnmultiplecleardocchasebutton = $(this);
});

$(document).off('submit', '#frmRaiseEsclation').on('submit', '#frmRaiseEsclation', function (e) 
{
	var OrderUID = $('#OrderUID').val();

	var button = $('.btnRaiseEsclation');
	var button_text = $('.btnRaiseEsclation').html();

	$(button).prop('disabled', true);
	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Raising');

	var formdata = new FormData($(this)[0]);
	formdata.append('OrderUID', OrderUID);
	formdata.append('Page', Const_Page);

	$.ajax({
		type: "POST",
		url: base_url + 'OrderComplete/RaiseEsclation',
		data: formdata,
		dataType: 'json',
		cache: false,
		processData: false,
		contentType: false,
		beforeSend: function () {
			button.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success: function (data) {
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: 'Esclation Raised'
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();

				if (check_is_url_contains_string_value(window.location.href)) {
					window.location.reload();
				} else {
					triggerpage(window.location.href);
				}
				$('#RaiseEsclation').modal('hide');
			} else {
				$.notify({
					icon: "icon-bell-check",
					message: 'Esclation Raised Failed'
				}, {
					type: "danger",
					delay: 1000
				});
				button.html(button_text);
				button.attr("disabled", false);
			}
		},
		error: function (jqXHR) {
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to Complete</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
			button.html(button_text);
			button.attr("disabled", false);
		}
	});
});

$(document).off('submit', '#frmClearEsclation').on('submit', '#frmClearEsclation', function (e) 
{
	var OrderUID = $('#OrderUID').val();

	var button = $('.btnClearEsclation');
	var button_text = $('.btnClearEsclation').html();

	$(button).prop('disabled', true);
	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Raising');

	var formdata = new FormData($(this)[0]);
	formdata.append('OrderUID', OrderUID);
	formdata.append('Page', Const_Page);
	$.ajax({
		type: "POST",
		url: base_url + 'OrderComplete/ClearEsclation',
		data: formdata,
		dataType: 'json',
		cache: false,
		processData: false,
		contentType: false,
		beforeSend: function () {
			button.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success: function (data) {
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: 'Esclation Cleared'
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();

				window.location.reload();
				$('#ClearEsclation').modal('hide');
			} else {
				$.notify({
					icon: "icon-bell-check",
					message: 'Esclation Cleared Failed'
				}, {
					type: "danger",
					delay: 1000
				});
				button.html(button_text);
				button.attr("disabled", false);
			}
		},
		error: function (jqXHR) {
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to Complete</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
			button.html(button_text);
			button.attr("disabled", false);
		}
	});
});

$(document).off('submit', '#frmRaiseDocChase').on('submit', '#frmRaiseDocChase', function (e) {

	e.preventDefault();
	e.stopPropagation();
	var OrderUID = $('#OrderUID').val();

	var button = $('.btnraisedocchase');
	var button_text = $('.btnraisedocchase').html();
	/*if($('#docchaseraiseReason').val() == '') {
		$.notify({
			icon: "icon-bell-check",
			message: 'Select Reason'
		}, {
			type: "danger",
			delay: 1000
		});
		return false;
	}*/	
	$(button).prop('disabled', true);
	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Raising');

	var formdata = new FormData($(this)[0]);
	formdata.append('OrderUID', OrderUID);
	formdata.append('Page', Const_Page);

	fn_raise_docchase(formdata, button, button_text);
});

$(document).off('submit', '#frm_completemultipledocchase').on('submit', '#frm_completemultipledocchase', function (e) {

	e.preventDefault();
	e.stopPropagation();
	var OrderUID = Const_ORDERUID;

	var button = $btnmultiplecleardocchasebutton;
	var button_text = $btnmultiplecleardocchasebutton.html();
	/*if($('#multipledocchaseclearReason').val() == '') {
		$.notify({
			icon: "icon-bell-check",
			message: 'Select Reason'
		}, {
			type: "danger",
			delay: 1000
		});
		return false;
	}*/
	$(button).prop('disabled', true);
	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Clearing');

	var WorkflowModuleUID = $('.WorkflowModuleUIDClearChase_box:checked').map(function(i, e) {return $(e).attr('data-WorkflowModuleUID') }).toArray();


	var formdata = new FormData($(this)[0]);
	formdata.append('OrderUID', OrderUID);
	formdata.append('submit', btnmultiplecleardocchase_value);
	formdata.append('Page', Const_Page);
	formdata.append('WorkflowModuleUID', WorkflowModuleUID);

	$.when(AutoUpdate(new FormData($("#frmordersummary")[0]))).then(fn_clear_multipledocchase(formdata, button, button_text));

});


$(document).off('submit', '#frmclearDocChase').on('submit', '#frmclearDocChase', function (e) {

	e.preventDefault();
	e.stopPropagation();
	var OrderUID = Const_ORDERUID;

	var button = $button;
	var button_text = $button.html();
	/*if($('#docchaseclearReason').val() == '') {
		$.notify({
			icon: "icon-bell-check",
			message: 'Select Reason'
		}, {
			type: "danger",
			delay: 1000
		});
		return false;
	}*/

	$(button).prop('disabled', true);
	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Clearing');

	var formdata = new FormData($(this)[0]);
	formdata.append('OrderUID', OrderUID);
	formdata.append('submit', btncleardocchase_value);
	formdata.append('Page', Const_Page);
	$.when(AutoUpdate(new FormData($("#frmordersummary")[0]))).then(fn_clear_docchase(formdata, button, button_text));
});

$(document).off('click', '.addchecklistrow').on('click', '.addchecklistrow', function (e)
      {
      	var workflowUId = $(this).attr('data-moduleUID');
      	var count = $(this).attr('data-count');
        $(this).attr('data-count',Number(count)+1);
      	$("table.checklisttable tbody").append(`<tr class=" questionlist removeRow">
        <td>
        <textarea placeholder="Checklist" class="form-control checklists" id="Comments" name="checklist[`+workflowUId+`][OtherChecklist][N`+count+`][question]" rows="1"></textarea>
        </td>
        <td>
        <select name="checklist[`+workflowUId+`][OtherChecklist][N`+count+`][Answer]" title="Findings"  class="form-control form-check-input1 checklists pre_select" >
        <option value="empty"></option>
        <option value="Completed">Completed</option>
        <option value="Problem Identified">Problem Identified</option>
        <option value="NA">NA</option>
        </select>
        </td>

        <td class="form-check dynamicCheckedList" style="text-align: center;border: 0!important;padding-top: 7px!important;">
        <label class="form-check-label Dashboardlable" for="[`+workflowUId+`][OtherChecklist`+count+`][IsChaseSend]"  style="color: teal">
        <input class="form-check-input checklists allworkflow " id = "[`+workflowUId+`][OtherChecklist`+count+`][IsChaseSend]" type="checkbox"  name="checklist[`+workflowUId+`][OtherChecklist][N`+count+`][FileUploaded]"> 
        <span class="form-check-sign">
        <span class="check"></span>
        </span>
        </label>
        </td>

        <td>
        <select name="checklist[`+workflowUId+`][OtherChecklist][N`+count+`][IsChaseSend]" title="
        Send to Chase"  class="form-control form-check-input1 checklists pre_select" >
        <option value="empty"></option>
        <option value="NA">NA</option>
        <option value="YES">YES</option>
        <option value="CANCELLED">CANCELLED</option>
        <option value="COMPLETED">COMPLETED</option>
        </select>
        </td>

        <td class="icon_minus_td">
        <textarea placeholder="Comments" class="form-control checklists" id="Comments" name="checklist[`+workflowUId+`][OtherChecklist][N`+count+`][Comments]" rows="1"></textarea>
         <a style="width:8%;float:right;"><i class="fa fa-minus-circle removechecklist pull-right" aria-hidden="true" style='font-size: 20px;margin-top: 10px;;'></i></a>
     </td>
        </tr>`);
      	$('select.pre_select').select2()
      	.one('select2-focus', OpenSelect2)
      	.on("select2-blur", function (e) {
      		$(this).one('select2-focus', OpenSelect2)
      	})

      	function OpenSelect2() {
      		var $select2 = $(this).data('select2');
      		setTimeout(function() {
      			if (!$select2.opened()) { $select2.open(); }
      		}, 0);  
      	}
    });



     $(document).off('click', '.removechecklist').on('click', '.removechecklist', function (e)
     {
      $(this).closest('.removeRow').remove();
     });
      $(document).off('click', '.ProblemIdentifiedbtn').on('click', '.ProblemIdentifiedbtn', function (e)
     {
     	if($(this).attr('data-status') == 'show')
     	{
     		$('.ProblemIdentified').attr('style','display : ');
     		$(this).attr('data-status','hide');
     		$(this).text('Show Problem Identified');
     		$(this).attr('title','Show Problem Identified')
     	}
     	else
     	{
     		$('.ProblemIdentified').attr('style','display : none');
     		$(this).attr('data-status','show');
     		$(this).text('Show All Checklist');
     		$(this).attr('title','Show All Checklist')
     	}
      
     });
       $(document).off('focus focusout', '.checklists').on('focus focusout', '.checklists', function (e)
      	{
			if ($(this).is(":focus")) {
				$('.checklists').removeClass('highlight');
				$(this).siblings('.form-check-sign').children('.check').removeClass('check_highlight');
				if($(this).attr('type') == 'checkbox')
				{
					$(this).siblings('.form-check-sign').children('.check').addClass('check_highlight');
				}
				else
				{
					$(this).addClass('highlight');
				}
			}else{
				
				if($(this).attr('type') == 'checkbox')
				{
					$(this).siblings('.form-check-sign').children('.check').removeClass('check_highlight');
				}
				else
				{
					$('.checklists').removeClass('highlight');
				}
			}
		});		


  //parking queue


  $(document).off('submit', '#frmRaiseParking').on('submit', '#frmRaiseParking', function (e) {

  	e.preventDefault();
  	e.stopPropagation();
  	var OrderUID = $('#OrderUID').val();

  	var button = $('.btnraiseparking');
  	var button_text = button.html();

  	$(button).prop('disabled', true);
  	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Raising');

  	var formdata = new FormData($(this)[0]);
  	formdata.append('OrderUID', OrderUID);
  	formdata.append('Page', Const_Page);

  	fn_raise_parking(formdata, button, button_text);
  });

  $(document).off('submit', '#frmclearParking').on('submit', '#frmclearParking', function (e) {

  	e.preventDefault();
  	e.stopPropagation();
  	var OrderUID = Const_ORDERUID;

  	var button = $('.btnclearparking');
  	var button_text = button.html();

  	$(button).prop('disabled', true);
  	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Clearing');

  	var formdata = new FormData($(this)[0]);
  	formdata.append('OrderUID', OrderUID);
  	formdata.append('Page', Const_Page);
  	fn_clear_parking(formdata, button, button_text);
  });

  var fn_raise_parking = function (formdata, button, button_text) {
  	var OrderUID = $('#OrderUID').val();

  	$.ajax({
  		type: "POST",
  		url: base_url + 'OrderComplete/RaiseParking',
  		data: formdata,
  		dataType: 'json',
  		cache: false,
  		processData: false,
  		contentType: false,
  		beforeSend: function () {
  			button.attr("disabled", true);
  			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
  		},
  		success: function (data) {
  			if (data.validation_error == 0) {
  				/*Sweet Alert MSG*/
  				$.notify({
  					icon: "icon-bell-check",
  					message: data['message']
  				}, {
  					type: "success",
  					delay: 1000
  				});
  				disposepopover();

  				if (check_is_url_contains_string_value(window.location.href)) {
  					window.location.reload();
  				} else {
  					triggerpage(window.location.href);
  				}
  				$('#ParkingQueue').modal('hide');
  			} else {
  				$.notify({
  					icon: "icon-bell-check",
  					message: data['message']
  				}, {
  					type: "danger",
  					delay: 1000
  				});
  				button.html(button_text);
  				button.attr("disabled", false);
  			}
  		},
  		error: function (jqXHR) {
  			swal({
  				title: "<i class='icon-close2 icondanger'></i>",
  				html: "<p>Failed to Complete</p>",
  				confirmButtonClass: "btn btn-success",
  				allowOutsideClick: false,
  				width: '300px',
  				buttonsStyling: false
  			}).catch(swal.noop);
  			button.html(button_text);
  			button.attr("disabled", false);
  		}
  	});
  };

  var fn_clear_parking = function (formdata, button, button_text) {

  	var OrderUID = $('#OrderUID').val();
  	$.ajax({
  		type: "POST",
  		url: base_url + 'OrderComplete/ClearParking',
  		data: formdata,
  		dataType: 'json',
  		cache: false,
  		processData: false,
  		contentType: false,
  		beforeSend: function () {
			button.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success: function (data) {
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/

				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				if (check_is_url_contains_string_value(window.location.href)) {
					window.location.reload();
				} else {
					triggerpage(window.location.href);
				}
				$('#ClearParking').modal('hide');
			} 
			else if(data.validation_error == 2){

				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 4000
				});

			}
			else {
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 1000
				});
				button.html(button_text);
				$(button).prop('disabled', false);
			}

			// button.attr("disabled", false);
			// $submitbuttons.attr("disabled", false);
		},
		error: function (jqXHR) {
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to Complete</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
		}
	});
};

var fn_raise_Withdrawal = function (formdata, button, button_text) {
	var OrderUID = $('#OrderUID').val();
  	
  	$.ajax({
  		type: "POST",
  		url: base_url + 'OrderComplete/RaiseWithdrawal',
  		data: formdata,
  		dataType: 'json',
  		cache: false,
  		processData: false,
  		contentType: false,
  		beforeSend: function () {
  			button.attr("disabled", true);
  			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
  		},
  		success: function (data) {
  			if (data.validation_error == 0) {
  				/*Sweet Alert MSG*/
  				$.notify({
  					icon: "icon-bell-check",
  					message: data['message']
  				}, {
  					type: "success",
  					delay: 1000
  				});
  				disposepopover();

  				if (check_is_url_contains_string_value(window.location.href)) {
  					window.location.reload();
  				} else {
  					triggerpage(window.location.href);
  				}
  				$('#RaiseWithdrawal').modal('hide');
  			} else {
  				$.notify({
  					icon: "icon-bell-check",
  					message: data['message']
  				}, {
  					type: "danger",
  					delay: 1000
  				});
  				button.html(button_text);
  				button.attr("disabled", false);
  			}
  		},
  		error: function (jqXHR) {
  			swal({
  				title: "<i class='icon-close2 icondanger'></i>",
  				html: "<p>Failed to Complete</p>",
  				confirmButtonClass: "btn btn-success",
  				allowOutsideClick: false,
  				width: '300px',
  				buttonsStyling: false
  			}).catch(swal.noop);
  			button.html(button_text);
  			button.attr("disabled", false);
  		}
  	});
  }

  var fn_clear_Withdrawal = function (formdata, button, button_text) {

  	var OrderUID = $('#OrderUID').val();
  	$.ajax({
  		type: "POST",
  		url: base_url + 'OrderComplete/ClearWithdrawal',
  		data: formdata,
  		dataType: 'json',
  		cache: false,
  		processData: false,
  		contentType: false,
  		beforeSend: function () {
			button.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success: function (data) {
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/

				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				disposepopover();
				if (check_is_url_contains_string_value(window.location.href)) {
					window.location.reload();
				} else {
					triggerpage(window.location.href);
				}
				$('#ClearWithdrawal').modal('hide');
			} 
			else if(data.validation_error == 2){

				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 4000
				});

			}
			else {
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 1000
				});
				button.html(button_text);
				$(button).prop('disabled', false);
			}

		},
		error: function (jqXHR) {
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to Complete</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
		}
	});
  }

  //withdrawal queue
  $(document).off('submit', '#frmraiseWithdrawal').on('submit', '#frmraiseWithdrawal', function (e) {

  	e.preventDefault();
  	var OrderUID = $('#OrderUID').val();

  	var button = $('#btnraiseWithdrawal');
  	var button_text = button.html();
  	
  	$(button).prop('disabled', true);
  	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Raising');

  	var formdata = new FormData($(this)[0]);
  	formdata.append('OrderUID', OrderUID);
  	formdata.append('Page', Const_Page);
  	fn_raise_Withdrawal(formdata, button, button_text);
  });

  $(document).off('submit', '#frmclearWithdrawal').on('submit', '#frmclearWithdrawal', function (e) {

  	e.preventDefault();
  	var OrderUID = Const_ORDERUID;

  	var button = $('#btnclearWithdrawal');
  	var button_text = button.html();

  	$(button).prop('disabled', true);
  	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Clearing');

  	var formdata = new FormData($(this)[0]);
  	formdata.append('OrderUID', OrderUID);
  	formdata.append('Page', Const_Page);
  	fn_clear_Withdrawal(formdata, button, button_text);
  });



$(document).off('click', '.btnChangeOrderAssignment').on('click', '.btnChangeOrderAssignment', function (e) 
{
	var OrderUID = $('#OrderUID').val();

	var button = $('.btnChangeOrderAssignment');
	var button_text = $('.btnChangeOrderAssignment').html();

	$(button).prop('disabled', true);
	$(button).html('<i class="fa fa-spin fa-spinner"></i> ...Raising');

	var OrderAssignmentUID = $(this).attr('data-OrderAssignmentUID');
	$.ajax({
		type: "POST",
		url: base_url + 'CommonController/ChangeOrderAssignment',
		data: {'OrderAssignmentUID':OrderAssignmentUID},
		dataType: 'json',
		beforeSend: function () {
			button.attr("disabled", true);
			button.html('<i class=""fa fa-spin fa-spinner"></i> Loading ...');
		},
		success: function (data) {
			if (data.validation_error == 0) {
				/*Sweet Alert MSG*/
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "success",
					delay: 1000
				});
				window.location.reload();
				//disposepopover();
				
				$('#ChangeOrderAssignment').modal('hide');
			} else {
				$.notify({
					icon: "icon-bell-check",
					message: data['message']
				}, {
					type: "danger",
					delay: 1000
				});
				button.html(button_text);
				button.attr("disabled", false);
			}
		},
		error: function (jqXHR) {
			swal({
				title: "<i class='icon-close2 icondanger'></i>",
				html: "<p>Failed to change</p>",
				confirmButtonClass: "btn btn-success",
				allowOutsideClick: false,
				width: '300px',
				buttonsStyling: false
			}).catch(swal.noop);
			button.html(button_text);
			button.attr("disabled", false);
		}
	});
});

$(document).off('click','.sendCommand').on('click','.sendCommand',function(e){
	e.preventDefault();
	var OrderUID = $('#OrderUID').val();
	var WorkflowModuleUID = $('#WorkflowModuleUID').val();
	var Commands = $('#Commands').val();
	var comments_val = $.trim(Commands);
	if(comments_val != ''){
		$.ajax({
			type :'post',
			url  :base_url+'CommonController/AddCommands',
			data : {'OrderUID' : OrderUID, 'WorkflowModuleUID' :WorkflowModuleUID,'Commands' : Commands},
			success: function(data)
			{
				$('.commandBox').val('');
				data = JSON.parse(data);
				if(data)
				{
					$.notify({
						message: 'Comment updated'
					}, {
						type: "success",
						delay: 1000
					});
					console.log(data);
					$('.CommandsappendTable').prepend(data);
				}
				else
				{
					$.notify({
						message: 'Comment UnUpdated'
					}, {
						type: "danger",
						delay: 1000
					});

				}
			},
			error: function (jqXHR, textStatus, errorThrown) {

				console.log(errorThrown);

			},
			failure: function (jqXHR, textStatus, errorThrown) {

				console.log(errorThrown);

			},
		});
	} else {
		$.notify({message: 'Comment Required'}, {type: "danger",delay: 1000});
	}
});

//change event for .meetingfield
$(document).off('change', '.meetingfield').on('change', '.meetingfield', function(e){
	e.preventDefault();
	
	var meetingobj = {};
	$('input.meetingfield, select.meetingfield').each(function (key, elem) {
		meetingobj[$(elem).attr('name')] = $(elem).val();
	});
	meetingobj['WorkflowModuleUID'] = $('#WorkflowModuleUID').val();
	meetingobj['MeetingOrderUID'] = $('#OrderUID').val();
	console.log(meetingobj);

	if(meetingobj['WorkflowModuleUID'] &&
		meetingobj['MeetingOrderUID'] &&
		meetingobj['PreferedTime'] &&
		meetingobj['PreferedTimeZone'] &&
		meetingobj.PreferedTime.match(/((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/g)) 
	{
		$.ajax({
			url: 'CommonController/SaveMeeting',
			type: 'POST',
			dataType: 'json',
			data: meetingobj,
			beforeSend: function(){
				
			},
		})
		.done(function(response) {
			console.log("success", response);
		})
		.fail(function(jqXHR) {
			console.error("error", jqXHR);
		})
		.always(function() {
			console.log("complete");
		});
		
	}
});

// setInterval(function(event){ 
// 	var init_url = window.location.href;
// 	url = $("#url").val();
// 	var formData = new FormData($("#frmordersummary")[0]);
// 	if (url == 'PreScreen' || url=='WelcomeCall' || url=='TitleTeam' || url=='FHA_VA_CaseTeam' || url=='ThirdPartyTeam') {
// 		AutoUpdate(formData);
// 	}
//  }, callUpdateTime);

$(".tablist").click(function(){
	var formData = new FormData($("#frmordersummary")[0]);
	AutoUpdate(formData);
})

function AutoUpdate(formData){
	$.ajax({
		type: "POST",
		url: base_url + 'Ordersummary/insert',
		data: formData, 
		dataType:'json',
		cache: false,
		processData:false,
		contentType:false,
		success: function(data)
		{

			console.log('Updated');
		},
		error: function (jqXHR, textStatus, errorThrown) {

			console.log(errorThrown);

		},
		failure: function (jqXHR, textStatus, errorThrown) {

			console.log(errorThrown);

		},
	});
}

/* Enter to save notes - Disabled form submit */
$('.commandBox').keypress(function(event){
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
		$('.sendCommand').trigger('click');
		event.preventDefault();
	}
});
