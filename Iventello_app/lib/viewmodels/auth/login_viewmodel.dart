import 'package:flutter/material.dart';
import '../../views/admin/admin_layout.dart';
import '../base_viewmodel.dart';

class LoginViewModel extends BaseViewModel {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<void> login(BuildContext context) async {
    setState(ViewState.busy);
    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      print('Logging in with ${emailController.text} / ${passwordController.text}');
      
      // Navigate to Dashboard
      // ignore: use_build_context_synchronously
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const AdminLayout()),
      );
      
      setState(ViewState.idle);
    } catch (e) {
      setError('Login failed: $e');
    }
  }
  
  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
