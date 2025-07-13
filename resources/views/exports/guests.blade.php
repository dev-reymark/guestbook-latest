<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Guests Report</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 1cm;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 9pt;
            color: #2c3e50;
        }
        .header {
            text-align: center;
            padding-bottom: 12px;
            margin-bottom: 20px;
            border-bottom: 2px solid #3498db;
        }
        .header h1 {
            margin: 0;
            font-size: 20pt;
            font-weight: 700;
        }
        .report-info {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            background-color: #f1f5f9;
            border-left: 5px solid #3498db;
            padding: 12px 15px;
            margin-bottom: 20px;
            border-radius: 6px;
        }
        .report-info p {
            margin: 4px 10px;
            font-size: 9pt;
            color: #555;
        }
        .report-info strong {
            color: #1e293b;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 8.5pt;
        }
        thead th {
            background-color: #3498db;
            color: #fff;
            font-weight: 600;
            padding: 8px 6px;
            text-transform: uppercase;
            font-size: 8pt;
            text-align: left;
            border: 1px solid #d1d5db;
        }
        tbody td {
            padding: 6px;
            border: 1px solid #e2e8f0;
            word-wrap: break-word;
            vertical-align: top;
        }
        tbody tr:nth-child(even) {
            background-color: #f9fafb;
        }
        tbody tr:hover {
            background-color: #eef6fb;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 10px;
            font-size: 8pt;
            color: #7f8c8d;
            border-top: 1px solid #d1d5db;
        }
        .badge {
            padding: 3px 7px;
            border-radius: 12px;
            font-size: 7.5pt;
            font-weight: 600;
            display: inline-block;
        }
        .badge-yes {
            background-color: #d4edda;
            color: #155724;
        }
        .badge-no {
            background-color: #f8d7da;
            color: #721c24;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .nowrap { white-space: nowrap; }
        .count-cell {
            font-weight: bold;
            color: #1d4ed8;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Guests Report</h1>
    </div>

    <div class="report-info">
        @if(isset($startDate) && isset($endDate))
            <p><strong>Date Range:</strong> <span class="nowrap">{{ date('M d, Y', strtotime($startDate)) }}</span> to <span class="nowrap">{{ date('M d, Y', strtotime($endDate)) }}</span></p>
        @endif
        <p><strong>Total Guests:</strong> {{ count($guests) }}</p>
        <p><strong>Generated on:</strong> <span class="nowrap">{{ date('M d, Y h:i:s A') }}</span></p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 4%;">ID</th>
                <th style="width: 12%;">Name</th>
                <th style="width: 8%;">ID Type</th>
                <th style="width: 10%;">ID Number</th>
                <th style="width: 14%;">Email</th>
                <th style="width: 10%;">Phone</th>
                <th style="width: 10%;">Company</th>
                <th style="width: 12%;">Address</th>
                <th style="width: 6%;">Agreed</th>
                <th style="width: 8%;">Last Visit</th>
                <th style="width: 6%;">Visits</th>
            </tr>
        </thead>
        <tbody>
            @foreach($guests as $guest)
            <tr>
                <td class="text-center">{{ $guest->id }}</td>
                <td>{{ $guest->name }}</td>
                <td>{{ $guest->id_type }}</td>
                <td>{{ $guest->id_number }}</td>
                <td>{{ $guest->email ?: '-' }}</td>
                <td class="nowrap">{{ $guest->phone ?: '-' }}</td>
                <td>{{ $guest->company ?: '-' }}</td>
                <td>{{ $guest->address ?: '-' }}</td>
                <td class="text-center">
                    <span class="badge badge-{{ $guest->is_agreed ? 'yes' : 'no' }}">
                        {{ $guest->is_agreed ? 'Yes' : 'No' }}
                    </span>
                </td>
                <td class="nowrap">
    {{ $guest->guestLogs->last() ? date('M d, Y h:i A', strtotime($guest->guestLogs->last()->check_in_time)) : 'Never' }}
</td>

                <td class="text-center count-cell">{{ $guest->guestLogs->count() }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Page 1 of 1 • {{ config('app.name') }} • Confidential</p>
    </div>

</body>
</html>
