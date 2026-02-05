import 'package:flutter/material.dart';
import 'package:iventello_app/viewmodels/base_viewmodel.dart';

class WorkerViewModel extends BaseViewModel {
   final List<Map<String, dynamic>> workers = [
    {
      'id': '101',
      'name': 'Alice Johnson',
      'role': 'Admin',
      'email': 'alice@iventello.com',
      'lastLogin': '2 mins ago'
    },
    {
      'id': '102',
      'name': 'Support Bot',
      'role': 'Support',
      'email': 'bot@iventello.com',
       'lastLogin': '1 day ago'
    },
  ];
}
