import 'package:flutter/material.dart';

class SettingsView extends StatelessWidget {
  const SettingsView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        _buildSectionHeader(context, "System Preferences"),
        const SwitchListTile(
          value: true,
          onChanged: null,
          title: Text("Dark Mode"),
          subtitle: Text("Enable dark theme for the admin panel"),
        ),
         const SwitchListTile(
          value: true,
          onChanged: null,
          title: Text("Email Notifications"),
          subtitle: Text("Receive alerts for new company registrations"),
        ),
         const Divider(),
         _buildSectionHeader(context, "Account"),
         ListTile(
           leading: const Icon(Icons.lock_outline),
           title: const Text("Change Password"),
           onTap: () {},
         ),
          ListTile(
           leading: const Icon(Icons.language),
           title: const Text("Language"),
           subtitle: const Text("English (US)"),
           onTap: () {},
         ),
      ],
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 16),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
          color: Theme.of(context).primaryColor,
          fontWeight: FontWeight.bold
        ),
      ),
    );
  }
}
