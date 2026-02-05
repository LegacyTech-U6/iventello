import 'package:flutter/material.dart';
import 'views/auth/login_view.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  print('--- APP STARTING ---');
  try {
    runApp(const MyApp());
    print('--- RUNAPP CALLED ---');
  } catch (e) {
    print('--- ERROR STARTING APP: $e ---');
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Iventello',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        // Using Emerald Green based on Web #059669
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF059669)),
        useMaterial3: true,
        inputDecorationTheme: const InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
        ),
      ),
      home: Scaffold(
        body: Center(
          child: Text(
            'DEBUG MODE: IF YOU SEE THIS, APP IS WORKING',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
        ),
      ),
      // home: const LoginView(),
    );
  }
}
