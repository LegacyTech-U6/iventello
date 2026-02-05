import 'package:flutter/material.dart';
import '../../viewmodels/admin/worker_viewmodel.dart';

class WorkerView extends StatefulWidget {
  const WorkerView({Key? key}) : super(key: key);

  @override
  State<WorkerView> createState() => _WorkerViewState();
}

class _WorkerViewState extends State<WorkerView> {
  final WorkerViewModel _viewModel = WorkerViewModel();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
         Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Row(
                children: [
                   Text("System Workers", style: Theme.of(context).textTheme.titleLarge),
                  const Spacer(),
                  OutlinedButton.icon(
                    onPressed: () {}, 
                    icon: const Icon(Icons.person_add),
                    label: const Text('Invite Worker'),
                  ),
                ],
              ),
            ),
        Expanded(
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 300,
              childAspectRatio: 1.5,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: _viewModel.workers.length,
            itemBuilder: (context, index) {
              final worker = _viewModel.workers[index];
              return Card(
                elevation: 0,
                shape: RoundedRectangleBorder(side: BorderSide(color: Colors.grey.shade200), borderRadius: BorderRadius.circular(12)),
                color: Colors.white,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(backgroundColor: Colors.blue.shade50, child: Text(worker['name'][0], style: TextStyle(color: Colors.blue.shade900))),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(worker['name'], style: const TextStyle(fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
                                Text(worker['role'], style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      const Divider(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                           Text(worker['lastLogin'], style: TextStyle(color: Colors.grey.shade400, fontSize: 12)),
                           IconButton(icon: const Icon(Icons.edit_outlined, size: 18), onPressed: (){})
                        ],
                      )
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
