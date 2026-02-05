import 'package:flutter/material.dart';
import '../../viewmodels/admin/company_viewmodel.dart';
import '../../viewmodels/base_viewmodel.dart'; // Base import

class CompanyView extends StatefulWidget {
  const CompanyView({Key? key}) : super(key: key);

  @override
  State<CompanyView> createState() => _CompanyViewState();
}

class _CompanyViewState extends State<CompanyView> {
  final CompanyViewModel _viewModel = CompanyViewModel();

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _viewModel,
      builder: (context, child) {
        if (_viewModel.isBusy) {
          return const Center(child: CircularProgressIndicator());
        }

        return Column(
          children: [
            // Filter / Action Bar
            Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Row(
                children: [
                   Text("Total: ${_viewModel.companies.length}", style: Theme.of(context).textTheme.titleMedium),
                  const Spacer(),
                  ElevatedButton.icon(
                    onPressed: () {}, // Add create functionality later
                    icon: const Icon(Icons.add),
                    label: const Text('Add Company'),
                  ),
                ],
              ),
            ),
            // Data Table / List
            Expanded(
              child: Card(
                clipBehavior: Clip.antiAlias,
                child: ListView.separated(
                  itemCount: _viewModel.companies.length,
                  separatorBuilder: (c, i) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final company = _viewModel.companies[index];
                    return ListTile(
                      leading: CircleAvatar(
                        child: Text(company['name'][0]),
                      ),
                      title: Text(company['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text("${company['email']} • Owner: ${company['owner']}"),
                      trailing: Chip(
                        label: Text(company['status']),
                        backgroundColor: company['status'] == 'Active' ? Colors.green.shade50 : Colors.red.shade50,
                        labelStyle: TextStyle(
                            color: company['status'] == 'Active' ? Colors.green.shade800 : Colors.red.shade800, fontSize: 12),
                          side: BorderSide.none,
                      ),
                      onTap: () {
                         ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Selected ${company['name']}")));
                      },
                    );
                  },
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
