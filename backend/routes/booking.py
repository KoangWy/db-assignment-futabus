from flask import Blueprint, request, jsonify
from utils.database import db_connection

booking_bp = Blueprint("booking", __name__)

@booking_bp.route("/search-trips", methods=["GET"])
def search_trips():
    # Lấy tham số từ URL: ?station_id=1&date=2024-12-01
    station_id = request.args.get("station_id")
    travel_date = request.args.get("date")

    if not station_id or not travel_date:
        return jsonify({"error": "Missing station_id or date"}), 400

    conn = db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Query kết hợp: Trip, Bus, Route, Operator, và lấy giá vé (Fare)
        # Lưu ý: Lấy giá vé đầu tiên tìm thấy cho route đó để hiển thị
        query = """
            SELECT 
                t.trip_id,
                t.service_date,
                t.trip_status,
                rt.default_duration_time,
                rt.distance,
                s.station_name as departure_station,
                s.city as departure_city,
                b.vehicle_type,
                op.brand_name,
                (SELECT seat_price FROM fare f WHERE f.route_id = rt.route_id ORDER BY f.valid_from DESC LIMIT 1) as price
            FROM trip t
            JOIN routetrip rt ON t.route_id = rt.route_id
            JOIN station s ON rt.station_id = s.station_id
            JOIN bus b ON t.bus_id = b.bus_id
            JOIN operator op ON rt.operator_id = op.operator_id
            WHERE 
                s.station_id = %s 
                AND DATE(t.service_date) = %s
                AND t.trip_status = 'Scheduled'
            ORDER BY t.service_date ASC
        """
        cursor.execute(query, (station_id, travel_date))
        trips = cursor.fetchall()
        
        # Format lại dữ liệu cho đẹp
        results = []
        for trip in trips:
            # Xử lý time duration (nếu database trả về timedelta)
            duration = str(trip['default_duration_time']) if trip['default_duration_time'] else "N/A"
            
            results.append({
                "trip_id": trip['trip_id'],
                "time_start": trip['service_date'].strftime("%H:%M"),
                "date": trip['service_date'].strftime("%d/%m/%Y"),
                "route_name": f"{trip['departure_city']} -> Tuyến liên tỉnh", # Database thiếu điểm đến cụ thể nên tạm gọi chung
                "vehicle_type": trip['vehicle_type'],
                "distance": f"{trip['distance']}km",
                "duration": duration,
                "price": trip['price'] if trip['price'] else 0,
                "brand_name": trip['brand_name']
            })

        return jsonify({"status": "success", "data": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()