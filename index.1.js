module.exports = function(mapRoutes) {
    var routes = {},
        cities = {};
    noRoute = {
        stops: function() { return 0; },
        toString: function() { return 'NO SUCH ROUTE'; }
    };

    var city = function(name) {
        var city = {},
            connections = {};

        city.name = name;

        function build_route(origin, connection) {
            return routes.route(origin, connection.city, connection.distance);
        }

        city.add_connection = function(connection) {
            connections[connection.city] = connection;
        };

        city.toString = function() {
            return city.name;
        };

        city.all_routes = function(max_stops, number_of_stops) {
            max_stops = max_stops || 10;
            number_of_stops = number_of_stops || 1;
            if (number_of_stops > max_stops) return [];
            return city.build_connecting_routes(max_stops, number_of_stops + 1);
        };

        city.build_connecting_routes = function(max_stops, number_of_stops) {
            var found = [],
                connection, connecting_routes;
            Object.keys(connections).forEach(function(key) {
                connection = connections[key];
                found.push(build_route(city, connection));
                connection.city.all_routes(max_stops, number_of_stops).forEach(function(connecting_route) {
                    found.push(build_route(city, connection).connect_to(connecting_route));
                });
            });
            return found;
        };

        city.exact_route_to = function(destinations) {
            var connection = connections[destinations[0]],
                route = null;
            if (connection !== undefined) {
                route = build_route(city, connection);
                route = city.build_connection_to(route, destinations.slice(1));
            }
            return route;
        };

        city.build_connection_to = function(route, remaining_destinations) {
            if (remaining_destinations.length < 1) return route;
            if (route.destination.connects_to(remaining_destinations[0])) {
                return route.connect_to(route.destination.exact_route_to(remaining_destinations));
            }
            return null;
        };

        city.connects_to = function(other_city) {
            return connections[other_city] !== undefined;
        };

        return city;
    };

    routes_to_map = routes_to_map || '';

    routes.find_routes = function(origin, destination, max_stops) {
        destination = routes.city(destination);
        return routes.find_routes_from(origin, max_stops).filter(function(route) {
            return route.final_destination() === destination;
        });
    };

    routes.find_routes_with_number_of_stops = function(origin, destination, number_of_stops) {
        return routes.find_routes(origin, destination, number_of_stops).filter(function(route) {
            return route.stops() === number_of_stops;
        });
    };

    routes.find_shortest_route = function(origin, destination) {
        return routes.find_routes(origin, destination).reduce(function(route1, route2) {
            if (route1.distance() < route2.distance()) return route1;
            return route2;
        }, { distance: function() { return 999999; } });
    };

    routes.find_routes_less_than = function(origin, destination, max_distance) {
        return routes.find_routes(origin, destination).filter(function(route) {
            return route.distance() < max_distance;
        });
    };

    routes.find_routes_from = function(origin, max_stops) {
        max_stops = max_stops || 10;
        return routes.city(origin).all_routes(max_stops);
    };

    routes.find_exact_route = function() {
        var args = Array.prototype.slice.call(arguments);
        var route_cities = args.map(function(name) {
            return routes.city(name);
        });
        origin = route_cities[0];
        return origin.exact_route_to(route_cities.slice(1)) || no_route;
    };

    routes.route = function(origin, destination, distance) {
        var route = {},
            connection = {};

        connection.stops = function() { return 0; };
        connection.distance = function() { return 0; };
        connection.origins = function() { return ''; };
        connection.final_destination = function() { return null; };
        connection.toString = function() { return 'end of the line'; };

        route.origin = origin;
        route.destination = destination;

        route.stops = function() {
            return 1 + connection.stops();
        };

        route.distance = function() {
            return connection.distance() + distance;
        };

        route.connect_to = function(connecting_route) {
            if (connecting_route !== null) {
                connection = connecting_route;
            }
            return route;
        };

        route.origins = function() {
            return route.origin.toString() + connection.origins();
        };

        route.final_destination = function() {
            return connection.final_destination() || route.destination;
        };

        route.toString = function() {
            return route.origins() + route.final_destination().toString() + route.distance().toString();
        };

        return route;
    };

    routes.city = function(name) {
        var found = cities[name];
        if (found === undefined) {
            found = city(name);
            cities[name] = found;
        }
        return found;
    };



    (function(routes_to_map) {
        var route_pattern = /[a-zA-Z]{2}\d/g;
        routes_to_map.match(route_pattern).forEach(function(route_str) {
            var origin = routes.city(route_str.charAt(0)),
                destination = routes.city(route_str.charAt(1)),
                distance = parseInt(route_str.charAt(2), 10);
            origin.add_connection({
                city: destination,
                distance: distance
            });
        });
    })(routes_to_map);

    return routes;
};

Object.keys = function(obj) {
    var array = new Array();
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            array.push(prop);
        }
    }
    return array;
};