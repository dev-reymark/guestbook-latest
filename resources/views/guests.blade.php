<!DOCTYPE html>
<html>

<head>
    <title>Guests Report</title>
    <style>
        @page {
            size: landscape;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .header,
        .footer {
            background-color: #f2f2f2;
            padding: 10px;
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Guests List Report</h1>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>ID Type</th>
                    <th>ID Number</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Company</th>
                    <th>Address</th>
                    <th>Date Registered</th>
                    <!-- <th>Updated At</th> -->
                </tr>
            </thead>
            <tbody>
                @foreach($guests as $guest)
                <tr>
                    <td>{{ $guest->name }}</td>
                    <td>{{ $guest->id_type }}</td>
                    <td>{{ $guest->id_number }}</td>
                    <td>{{ $guest->email }}</td>
                    <td>{{ $guest->phone }}</td>
                    <td>{{ $guest->company }}</td>
                    <td>{{ $guest->address }}</td>
                    <td>{{ $guest->created_at }}</td>
                    <!-- <td>{{ $guest->updated_at }}</td> -->
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            <p>Datalogic Systems Corporation</p>
        </div>
    </div>
</body>

</html>