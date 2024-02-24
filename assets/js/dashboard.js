$(function () {
	$(document)
		.off("dp.change", "#chartfdate")
		.on("dp.change", "#chartfdate", function (e) {
			CustomerUID = $("#DashboardCustomer").val();
			ProductUID = $("#DashboardProduct").val();
			ProjectUID = $("#DashboardProject").val();
			DocTypeUID = $("#DashboardDocType").val();
			FromDate = $("#chartfdate").val();
			ToDate = $("#charttdate").val();
			if (CustomerUID == "") {
				CustomerUID = "all";
			}
			if (ProductUID == "") {
				ProductUID = "all";
			}
			if (ProjectUID == "") {
				ProjectUID = "all";
			}
			if (DocTypeUID == "") {
				DocTypeUID ="all";
			}
			var dategroup = $("#datefilter_type option:selected").attr(
				"data-groupby"
			);

			var data = {};
			data.Customer = CustomerUID;
			data.Product = ProductUID;
			data.Project = ProjectUID;
			data.DocType = DocTypeUID;
			data.from = FromDate;
			data.to = ToDate;
			data.dategroup = dategroup;

			fn_Ajax_Init(data);
		});

	$(document)
		.off("dp.change", "#charttdate")
		.on("dp.change", "#charttdate", function (e) {
			CustomerUID = $("#DashboardCustomer").val();
			ProductUID = $("#DashboardProduct").val();
			ProjectUID = $("#DashboardProject").val();
			DocTypeUID = $("#DashboardDocType").val();
			FromDate = $("#chartfdate").val();
			ToDate = $("#charttdate").val();
			if (CustomerUID == "") {
				CustomerUID = "all";
			}
			if (ProductUID == "") {
				ProductUID = "all";
			}
			if (ProjectUID == "") {
				ProjectUID = "all";
			}
			if (DocTypeUID == "") {
				DocTypeUID ="all";
			}
			var dategroup = $("#datefilter_type option:selected").attr(
				"data-groupby"
			);

			var data = {};
			data.Customer = CustomerUID;
			data.Product = ProductUID;
			data.Project = ProjectUID;
			data.DocType = DocTypeUID;
			data.from = FromDate;
			data.to = ToDate;
			data.dategroup = dategroup;

			fn_Ajax_Init(data);
		});

	$(document)
		.off("change", "#DashboardCustomer")
		.on("change", "#DashboardCustomer", function (e) {
			e.preventDefault();
			CustomerUID = $(this).val();

			ProductUID = $("#DashboardProduct").val();
			ProjectUID = $("#DashboardProject").val();
			DocTypeUID = $("#DashboardDocType").val();
			FromDate = $("#chartfdate").val();
			ToDate = $("#charttdate").val();
			if (CustomerUID == "") {
				CustomerUID = "all";
			}
			if (ProductUID == "") {
				ProductUID = "all";
			}
			if (ProjectUID == "") {
				ProjectUID = "all";
			}
			if (DocTypeUID == "") {
				DocTypeUID ="all";
			}
			var dategroup = $("#datefilter_type option:selected").attr(
				"data-groupby"
			);

			var data = {};
			data.Customer = CustomerUID;
			data.Product = ProductUID;
			data.Project = ProjectUID;
			data.DocType = DocTypeUID;
			data.from = FromDate;
			data.to = ToDate;
			data.dategroup = dategroup;

			fn_Ajax_Init(data);
			var requestdata = "Customer=" + CustomerUID;

			$("#DashboardProject").html('');
			SendAsyncAjaxRequest(
					"POST",
					"Dashboard/GetCustomerProducts",
					requestdata,
					"json",
					true,
					true,
					function () {
						// Before Send
					}
				)
				.then(function (response) {
					if (response.length > 0) {
						var ProjectCustomer = response;

						var Project_select = ProjectCustomer.reduce(function (
								accumulator,
								value
							) {
								return (
									accumulator +
									'<Option value="' +
									value.ProductUID +
									'">' +
									value.ProductName +
									"</Option>"
								);
							},
							"");

						$("#DashboardProduct").multiselect("destroy");

						$("#DashboardProduct").html(Project_select);
						//console.log(Project_select);
						Product_init_multiselect();
						Checkbox_init_multiselect();
					} else {
						$("#DashboardProduct").multiselect("destroy");

						$("#DashboardProduct").html('');

						Product_init_multiselect();
						Checkbox_init_multiselect();

						$("#DashboardProject").multiselect("destroy");

						$("#DashboardProject").html('');

						Project_init_multiselect();
						Checkbox_init_multiselect();

					}
					
				})
				.catch(function (reject) {});
		});

	$(document)
		.off("change", "#DashboardProduct")
		.on("change", "#DashboardProduct", function (e) {
			e.preventDefault();
			CustomerUID = $("#DashboardCustomer").val();

			ProductUID = $(this).val();
			ProjectUID = $("#DashboardProject").val();
			DocTypeUID =$("#DashboardDocType").val();
			FromDate = $("#chartfdate").val();
			ToDate = $("#charttdate").val();
			if (CustomerUID == "") {
				CustomerUID = "all";
			}
			if (ProductUID == "") {
				ProductUID = "all";
			}
			if (ProjectUID == "") {
				ProjectUID = "all";
			}
			if(DocTypeUID == ""){
				DocTypeUID="all";
			}
			var dategroup = $("#datefilter_type option:selected").attr(
				"data-groupby"
			);

			var data = {};
			data.Customer = CustomerUID;
			data.Product = ProductUID;
			data.Project = ProjectUID;
			data.DocType = DocTypeUID;
			data.from = FromDate;
			data.to = ToDate;
			data.dategroup = dategroup;

			fn_Ajax_Init(data);

			var requestdata = "ProductUID=" + ProductUID;

			$("#DashboardProject").html('');
			SendAsyncAjaxRequest(
					"POST",
					"Dashboard/GetProductProject",
					requestdata,
					"json",
					true,
					true,
					function () {
						// Before Send
					}
				)
				.then(function (response) {
					console.log(response);
					if (response.length > 0) {
						var ProjectLender = response;

						var Lender_select = ProjectLender.reduce(function (
								accumulator,
								value
							) {
								return (
									accumulator +
									'<Option value="' +
									value.ProjectUID +
									'">' +
									value.ProjectName +
									"</Option>"
								);
							},
							"");

						$("#DashboardProject").multiselect("destroy");

						$("#DashboardProject").html(Lender_select);
						console.log(Lender_select);
						Project_init_multiselect();
						Checkbox_init_multiselect();
					} else {
						$("#DashboardProject").multiselect("destroy");

						$("#DashboardProject").html('');

						Project_init_multiselect();
						Checkbox_init_multiselect();
					}
				})
				.catch(function (reject) {});
		});
		$(document)
		.off("change", "#DashboardProject")
		.on("change", "#DashboardProject", function (e) {
			e.preventDefault();
			CustomerUID = $("#DashboardCustomer").val();
			ProductUID = $("#DashboardProduct").val();
			ProjectUID = $("#DashboardProject").val();
			DocTypeUID =$("#DashboardDocType").val();
			FromDate = $("#chartfdate").val();
			ToDate = $("#charttdate").val();
			if (CustomerUID == "") {
				CustomerUID = "all";
			}
			if (ProductUID == "") {
				ProductUID = "all";
			}
			if (ProjectUID == "") {
				ProjectUID = "all";
			}
			if(DocTypeUID == ""){
				DocTypeUID="all";
			}
			var dategroup = $("#datefilter_type option:selected").attr(
				"data-groupby"
			);

			var data = {};
			data.Customer = CustomerUID;
			data.Product = ProductUID;
			data.Project = ProjectUID;
			data.DocType = DocTypeUID;
			data.from = FromDate;
			data.to = ToDate;
			data.dategroup = dategroup;

			fn_Ajax_Init(data);

		});

		$(document)
		.off("change", "#DashboardDocType")
		.on("change", "#DashboardDocType", function (e) {
			e.preventDefault();
			PackageUID = $(this).val();
			CustomerUID = $("#DashboardCustomer").val();
			ProductUID = $("#DashboardProduct").val();
			ProjectUID = $("#DashboardProject").val();
			DocTypeUID =$("#DashboardDocType").val();
			FromDate = $("#chartfdate").val();
			ToDate = $("#charttdate").val();
			if (CustomerUID == "") {
				CustomerUID = "all";
			}
			if (ProductUID == "") {
				ProductUID = "all";
			}
			if (ProjectUID == "") {
				ProjectUID = "all";
			}
			if(DocTypeUID == ""){
				DocTypeUID="all";
			}
			var dategroup = $("#datefilter_type option:selected").attr(
				"data-groupby"
			);

			var data = {};
			data.Customer = CustomerUID;
			data.Product = ProductUID;
			data.Project = ProjectUID;
			data.DocType = DocTypeUID;
			data.from = FromDate;
			data.to = ToDate;
			data.dategroup = dategroup;

			fn_Ajax_Init(data);
		});

	$(document)
		.off("change", "#datefilter_type")
		.on("change", "#datefilter_type", function (e) {
			e.preventDefault();

			var select = $(this);
			var selected_value = $(select).val();
			var option = $(select).find("option:selected");
			fromdate = $(option).attr("data-from");
			todate = $(option).attr("data-to");
			groupby = $(option).attr("data-groupby");
			$("#chartfdate").val(fromdate);
			$("#chartfdate").attr("value", fromdate);
			$("#charttdate").val(todate);
			$("#chartfdate").attr("value", todate);

			CustomerUID = $("#DashboardCustomer").val();
			ProductUID = $("#DashboardProduct").val();
			ProjectUID = $("#DashboardProject").val();
			DocTypeUID =$("#DashboardDocType").val();
			FromDate = $("#chartfdate").val();
			ToDate = $("#charttdate").val();
			if (CustomerUID == "") {
				CustomerUID = "all";
			}
			if (ProductUID == "") {
				ProductUID = "all";
			}
			if (ProjectUID == "") {
				ProjectUID = "all";
			}
			if(DocTypeUID == ""){
				DocTypeUID="all";
			}
			var dategroup = $("#datefilter_type option:selected").attr(
				"data-groupby"
			);

			var data = {};
			data.Customer = CustomerUID;
			data.Product = ProductUID;
			data.Project = ProjectUID;
			data.DocType = DocTypeUID;
			data.from = FromDate;
			data.to = ToDate;
			data.dategroup = dategroup;

			fn_Ajax_Init(data);
		});
	$(document)
		.off("change", "#chartfdate")
		.on("change", "#chartfdate", function (e) {
			e.preventDefault();
			fromdate = $(this).val();
		});

	$(document)
		.off("change", "#charttdate")
		.on("change", "#charttdate", function (e) {
			e.preventDefault();
			todate = $(this).val();
		});
}); //Document Ends

var fn_Ajax_Init = function fn_Ajax_Init(data) {
	addbodyspinner();
	var fn_Array = [];
	fn_Array[0] = dashboard(data);
	fn_Array[1] = DrawChartData(data);
	fn_Array[2] = DrawPieChart(data);
	fn_Array[3] = OrderAge(data);
	Promise.all(fn_Array).then(function (value) {
		removebodyspinner();
	});
};

$( document ).ajaxComplete(function() {
 setTimeout(function(){
 	 $('.bodyoverlaydiv').css('display','none');
	$('.d2tspinner-circular').css('display','none');
 },500);
});
