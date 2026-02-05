import 'package:flutter/material.dart';
import '../../utils/responsive_layout.dart';
import '../../viewmodels/auth/register_viewmodel.dart';
import '../../viewmodels/base_viewmodel.dart';

class RegisterView extends StatefulWidget {
  const RegisterView({Key? key}) : super(key: key);

  @override
  State<RegisterView> createState() => _RegisterViewState();
}

class _RegisterViewState extends State<RegisterView> {
  final RegisterViewModel _viewModel = RegisterViewModel();

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _viewModel,
      builder: (context, child) {
        return Scaffold(
          backgroundColor: Colors.white,
          body: ResponsiveLayout(
            mobile: _buildMobileLayout(context),
            desktop: _buildDesktopLayout(context),
          ),
        );
      },
    );
  }

  Widget _buildMobileLayout(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Center(
        child: SingleChildScrollView(
          child: _buildForm(context),
        ),
      ),
    );
  }

  Widget _buildDesktopLayout(BuildContext context) {
    return Row(
      children: [
        Expanded(
          flex: 1,
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 550),
              padding: const EdgeInsets.all(40),
              child: _buildForm(context),
            ),
          ),
        ),
        Expanded(
          flex: 1,
          child: Container(
            color: Theme.of(context).colorScheme.primaryContainer,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                   Icon(Icons.inventory_2_outlined,
                      size: 100, color: Theme.of(context).colorScheme.onPrimaryContainer),
                  const SizedBox(height: 20),
                   Text(
                    'Join Iventello',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                   Text(
                    'Start managing your business today',
                    style: TextStyle(color: Theme.of(context).colorScheme.onPrimaryContainer.withOpacity(0.8), fontSize: 18),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildForm(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (ResponsiveLayout.isMobile(context)) ...[
             const Align(
               alignment: Alignment.centerLeft,
               child: BackButton(),
             ),
             const SizedBox(height: 10),
        ],
        const Text(
          'Create Account',
          style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        const Text(
          'Get your free account now',
          style: TextStyle(color: Colors.grey),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _viewModel.firstNameController,
                decoration: InputDecoration(
                  labelText: 'First Name',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
            const SizedBox(width: 16),
             Expanded(
              child: TextField(
                controller: _viewModel.lastNameController,
                decoration: InputDecoration(
                  labelText: 'Last Name',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _viewModel.emailController,
          decoration: InputDecoration(
            labelText: 'Email',
            prefixIcon: const Icon(Icons.email_outlined),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
         const SizedBox(height: 16),
        TextField(
          controller: _viewModel.phoneController,
          decoration: InputDecoration(
            labelText: 'Phone',
            prefixIcon: const Icon(Icons.phone),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _viewModel.passwordController,
          obscureText: true,
          decoration: InputDecoration(
            labelText: 'Password',
            prefixIcon: const Icon(Icons.lock_outline),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        const SizedBox(height: 16),
         TextField(
          controller: _viewModel.confirmPasswordController,
          obscureText: true,
          decoration: InputDecoration(
            labelText: 'Confirm Password',
            prefixIcon: const Icon(Icons.lock_outline),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        const SizedBox(height: 24),
        if (_viewModel.errorMessage != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Text(
              _viewModel.errorMessage!,
              style: const TextStyle(color: Colors.red),
              textAlign: TextAlign.center,
            ),
          ),
        SizedBox(
          height: 50,
          child: ElevatedButton(
            onPressed: _viewModel.isBusy ? null : () => _viewModel.register(context),
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: _viewModel.isBusy
                ? const CircularProgressIndicator.adaptive()
                : const Text('Sign Up'),
          ),
        ),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Already have an account?"),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Login'),
            ),
          ],
        ),
      ],
    );
  }
}
