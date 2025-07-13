<!DOCTYPE html>
<html>
<head>
    <title>Guests Report</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Guests Report</h1>
    @if(isset($startDate) && isset($endDate))
        <p>Date Range: {{ $startDate }} to {{ $endDate }}</p>
    @endif
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>ID Type</th>
                <th>ID Number</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Address</th>
                <th>Agreed</th>
                <th>Last Visit</th>
                <th>Total Visits</th>
            </tr>
        </thead>
        <tbody>
            @foreach($guests as $guest)
            <tr>
                <td>{{ $guest->id }}</td>
                <td>{{ $guest->name }}</td>
                <td>{{ $guest->id_type }}</td>
                <td>{{ $guest->id_number }}</td>
                <td>{{ $guest->email }}</td>
                <td>{{ $guest->phone }}</td>
                <td>{{ $guest->company }}</td>
                <td>{{ $guest->address }}</td>
                <td>{{ $guest->is_agreed ? 'Yes' : 'No' }}</td>
                <td>{{ optional($guest->guestLogs->last())->check_in_time }}</td>
                <td>{{ $guest->guestLogs->count() }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>