import 'package:flutter/material.dart';
import 'package:iventello_app/viewmodels/base_viewmodel.dart'; // Correct import path after moving files

class CompanyViewModel extends BaseViewModel {
  // Mock Data
  final List<Map<String, dynamic>> companies = [
    {
      'id': '1',
      'name': 'Tech Solutions Ltd',
      'email': 'contact@techsolutions.com',
      'owner': 'John Doe',
      'status': 'Active'
    },
    {
       'id': '2',
      'name': 'Green Grocers',
      'email': 'info@greengrocers.com',
      'owner': 'Jane Smith',
      'status': 'Active'
    },
     {
       'id': '3',
      'name': 'Rapid Logistics',
      'email': 'support@rapidlogistics.com',
      'owner': 'Bob Brown',
      'status': 'Inactive'
    },
  ];

  Future<void> refresh() async {
    setState(ViewState.busy);
    await Future.delayed(const Duration(seconds: 1)); // Simulate fetch
    setState(ViewState.idle);
  }
}
