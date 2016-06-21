(function () {
    'use strict';

    angular
        .module('ScholarshipEnrollment')
        .controller('ScholarshipEnrollmentListCtrl', ['$scope', 'CrudService', 'FlashService', 'ngTableParams', '$state', 'AdminService', '$timeout',
            function ($scope, CrudService, FlashService, ngTableParams, $state, AdminService, $timeout) {
                $scope.viewScholarshipEnrollment = function (userId) {
                    $state.go('home.scholarshipenrollment-detail' , {id: userId});
                };

                $scope.getBranchDesc = function (branchCode){
                    return AdminService.getBranchDesc(branchCode);
                };

                $scope.getCourseDesc = function (courseCode){
                    return AdminService.getCourseDesc(courseCode);
                };

                $scope.getSchemeDesc = function (schemeCode){
                    return AdminService.getSchemeDesc(schemeCode);
                };


                $scope.createNewScholarshipEnrollment = function () {
                    $state.go('home.scholarshipenrollment-creation');
                };

                $scope.tableParams = new ngTableParams({
                    page: 1,            // show first pagez
                    count: 10,          // count per page
                    sorting: {
                        name: 'asc'     // initial sorting
                    }
                }, {
                    total: 0,           // length of data
                    getData: function($defer, params) {
                        CrudService.scholarshipEnrollmentService.GetAll().then(function(data) {
                            if(data.message) {
                                $scope.scholarshipenrollment = [];
                                FlashService.Error(data.message)
                            } else {
                                $timeout(function() {
                                    params.total(data.length);
                                    $defer.resolve(data);
                                }, 10);
                            }
                        }, function() {
                            $scope.scholarshipenrollment = []
                        })
                    }
                });
            }])
        .controller('ScholarshipEnrollmentDetailCtrl', ['$scope', '$stateParams', 'CrudService', 'AdminService', '$location',
            function ($scope, $stateParams, CrudService, AdminService, $location) {

                $scope.loadStudent = function () {
                    CrudService.scholarshipEnrollmentService.GetById($stateParams.id).then(function (res) {
                        $scope.scholarshipenrollment = res
                    })
                }

                $scope.getBranchDesc = function (branchCode){
                    return AdminService.getBranchDesc(branchCode);
                };

                $scope.getCourseDesc = function (courseCode){
                    return AdminService.getCourseDesc(courseCode);
                };

                $scope.getSchemeDesc = function (schemeCode){
                    return AdminService.getSchemeDesc(schemeCode);
                };

                $scope.getMarketingEmployeeName = function (schemeCode){
                    return AdminService.getMarketingEmployeeName(schemeCode);
                };

                $scope.goToFms = function(code) {
                    $location.path('/fms/STUDENT/'+code);
                }


                $scope.loadStudent();
            }])
        .controller('ScholarshipEnrollmentCreationCtrl', ['$scope', 'CrudService', 'FlashService', '$state', 'AdminService',
            function ($scope, CrudService, FlashService, $state, AdminService) {

                $scope.educationDetails = [];
                $scope.guardians = [];

                // to load default once
                $scope.educationDetails.push({
                    examPassed: '',
                    instituteName: '',
                    groupName: '',
                    passingYear: '',
                    percentageObtained: '',
                    remark: ''
                });

                $scope.guardians.push({
                    isEmployed: '',
                    name: '',
                    occupation: '',
                    monthlyIncome: '',
                    annualIncome: '',
                    gender: '',
                    relationShip: '',
                    phoneNumber: ''
                });

                $scope.createNewScholarshipEnrollment = function () {

                    $scope.guardians.forEach(function (guaridian){
                        guaridian.annualIncome = guaridian.monthlyIncome * 12;
                    });

                    $scope.scholarshipenrollment.student.address = $scope.address;
                    $scope.scholarshipenrollment.student.guardians = $scope.guardians;
                    $scope.scholarshipenrollment.student.educationDetails = $scope.educationDetails;
                    $scope.scholarshipenrollment.student.status = 'CREATED';

                    $scope.scholarshipenrollment.student.branchCode = AdminService.getBranchCode($scope.branchName);
                    $scope.scholarshipenrollment.student.schemeCode = AdminService.getSchemeCode($scope.schemeName);
                    $scope.scholarshipenrollment.student.courseCode = AdminService.getCourseCode($scope.courseName);
                    $scope.scholarshipenrollment.student.marketingEmployeeCode = AdminService.getMarketingEmployeeCode($scope.referalName);


                    CrudService.scholarshipEnrollmentService.Create($scope.scholarshipenrollment).then(function () {
                        FlashService.Success("Successfuly Inserted !!", true);
                        $state.go('home.scholarshipenrollment-list');
                    });
                }

                $scope.removeGuardian = function () {
                    $scope.guardians.splice(-1, 1);
                };

                $scope.addGuardian = function () {
                    $scope.guardians.push({
                        isEmployed: '',
                        name: '',
                        occupation: '',
                        monthlyIncome: '',
                        annualIncome: '',
                        gender: '',
                        relationShip: '',
                        phoneNumber: ''
                    });
                };

                $scope.removeEducationDetail = function () {
                    $scope.educationDetails.splice(-1, 1);
                };

                $scope.addEducationDetail = function () {
                    $scope.educationDetails.push({
                        examPassed: '',
                        instituteName: '',
                        groupName: '',
                        passingYear: '',
                        percentageObtained: '',
                        remark: ''
                    });
                };

                $scope.getFeesParticularDesc = function (feesParticularCode){
                    return AdminService.getFeesParticularDesc(feesParticularCode);
                };

                $scope.init = function () {

                    AdminService.getConstants(function (data) {
                        $scope.commonAttributes = data;
                    });

                    AdminService.getMarketingEmployees(function (data) {
                        $scope.marketingEmployees = data;
                    });

                    AdminService.getBranches(function (data) {
                        $scope.branches = data;
                        $scope.branchNames = _.pluck(data, "name")
                    });

                    AdminService.getSchemes(function (data) {
                        $scope.schemes = data;
                        $scope.schemeNames = _.pluck(data, "name")
                    });

                    AdminService.getCourses(function (data) {
                        $scope.courseNames = _.pluck(data, "name")
                    });
                }

                $scope.init();

            }]);

})();
