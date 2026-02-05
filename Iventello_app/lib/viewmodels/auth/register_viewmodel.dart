import 'package:flutter/material.dart';
import '../base_viewmodel.dart';

class RegisterViewModel extends BaseViewModel {
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();

  Future<void> register(BuildContext context) async {
    setState(ViewState.busy);
    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      print('Registering user ${emailController.text}');
      
      // ignore: use_build_context_synchronously
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Registration Simulated Successfully!')),
      );
      
      setState(ViewState.idle);
    } catch (e) {
      setError('Registration failed: $e');
    }
  }

  @override
  void dispose() {
    firstNameController.dispose();
    lastNameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }
}
