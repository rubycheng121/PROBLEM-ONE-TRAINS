# PROBLEM-ONE-TRAINS
practice work

How to Runnung:
======================================

1. Please install node.js in the shell

    (1. https://nodejs.org/en/download/)

    (2. Use brew to install ```brew install node``` )


2. Install the project's package

    ```npm install```


3. Use mocha running the test 

    ```npm run test```


PROBLEM ONE:  TRAINS
======================================

Problem:  
The local commuter railroad services a number of cities in Taiwan.  Because of the mountainous local geography, all of the tracks are 'one-way.' 

That is, a route from Kaoshiung to Taipei does not imply the existence of a route from Taipei to Kaoshiung.  

In fact, even if both of these routes do happen to exist, they are distinct and are not necessarily the same distance as the tracks may have to go over different terrain!

The purpose of this problem is to help the railroad provide its customers with information about the routes.  

In particular, you will compute the distance along a certain route, the number of different routes between two towns, and the shortest route between two cities.


Input:  

A directed graph (see Test Input below) where a node represents a city and an edge represents a route between two cities.  

The weighting of the edge represents the distance between the two cities. 

A given route will never appear more than once, and for a given route, the starting and ending city will not be the same city.



Output: 
For test input 1 through 5, if no such route exists, output 'NO SUCH ROUTE'.  

Otherwise, follow the route as given; do not make any extra stops!  

For example, the first problem means to start at city A, then travel directly to city B (a distance of 5), then directly to city C (a distance of 4).



a.	The distance of the route A-B-C.

b.	The distance of the route A-D.

c.	The distance of the route A-D-C.

d.	The distance of the route A-E-B-C-D.

e.	The distance of the route A-E-D.

f.	The number of trips starting at C and ending at C with a maximum of 3 stops.  In the sample data below, there are two such trips: C-D-C (2 stops). and C-E-B-C (3 stops).

g.	The number of trips starting at A and ending at C with exactly 4 stops. In the sample data below, there are three such trips: A to C (via B,C,D); A to C (via D,C,D); and A to C (via D,E,B).

h.	The length of the shortest route (in terms of distance to travel) from A to C.

i.	The length of the shortest route (in terms of distance to travel) from B to B.

j.	The number of different routes from C to C with a distance of less than 50. E.g. CDC, CEBC are both trips of less than 50.


Test Input:

For the test input, the towns are named using the first few letters of the alphabet from A to E.  

A route between two towns (A to B) with a distance of 5 is represented as <A,B,5>.


Graph: 

<A,B,5>

<B,C,4>

<C,D,8>

<D,C,8>

<D,E,6>

<A,D,5>

<C,E,2>

<E,B,3>

<A,E,7>

Solution
======================================
a.9

b.5

c.13

d.22

e.'NO SUCH ROUTE'

f.2

g.3

h.9

i.9

j.39

How to use
======================================
1. create a train Object

copy ```var train = require('../index')('./inputFile.txt')``` to the target javascript file.

2. read input file to get graphArray

    ```let data = train.read('./inputFile.txt')```
    ```let graphArray = graphArray = train.getGraphArray(data)```
    or
    ```let data = ['A,B,5', 'B,C,4', 'C,D,8', 'D,C,8', 'D,E,6', 'A,D,5', 'C,E,2', 'E,B,3', 'A,E,7']```

3. create a graph then get vertexSet
    ```let vertexSet = train.buildGraph(graphArray)```

4. get the distance of a path

    example:
     ```let result = train.getdistance('A-B-C')```
     ```let result = train.getdistance('A-D')```

5. get the path count (walk count <= MaxStep)

    example:
    from 'C' to 'C' and the max step is 3
     ```let result =  train.getWalkNumLessEqualThenMaxStep_DynamicProgramming('C', 'C', 3, vertexSet, false)```

6. get the path count (walk count = MaxStep)

    example:
    from 'A' to 'C' and the max step is 4
    ```let result = train.getWalkNumEqualMaxStep_DynamicProgramming('A', 'C', 4, vertexSet)```

7. get the shortest path

    example: 
    from 'A' to 'C'
    ```let result = train.getShortestLength(vertexSet["A"], vertexSet["C"])```
    from 'B' to 'B'
    ```let result = train.getShortestLength(vertexSet["B"], vertexSet["B"])```

8. get the path count (path length < maxlength)

    example:
    from 'C' to 'C' and the max length is 50
    ```let result = train.getWalkNumLessEqualThenMaxStep_DynamicProgramming('C', 'C', 50 - 1, vertexSet, true)```

9. print the result 

    ```console.log(result)```

Idea
======================================

1. train.getdistance(pathString)

a. design Vertex and Edge Object,use for loop to get each length and calculate the sum

 Vertex: 
```js
    var Vertex = function(name) {
        this.getName = function() { return name };
        let edges = [];
        let childEdge = {};
        let childVertexs = [];

        this.getEdges = function() { return edges; };
        this.getchildVertexs = function() { return childVertexs; }
        this.getchildEdges = function(vertex) { return childEdge[vertex]; }
        this.getEdges = function() { return edges; };
        this.addEdge = function(Edge, nextVertex) {
                    childEdge[nextVertex] = Edge;
                    edges.push(Edge)
                    childVertexs.push(nextVertex)
            };
    }
```
        
Edge
```js
    var Edge = function(preVertex, nextVertex, weight) {
        this.getPre = function() { return preVertex; };
        this.getNext = function() { return nextVertex; };
        this.getWeight = function() { return weight; };
    }
```
b.split the array and get the distance

```js
    train.getdistance = function(path) {
        let array = path.split("-")
        let Distance = 0
        for (let i = 0; i < array.length - 1; i++) {
            let d = getSingleWeight(array[i], array[i + 1])
            if (d == 'NO SUCH ROUTE') {
                Distance = d
                break;
            } else {
                Distance = Distance + d
            }
        }
        return Distance;
    }
```

2. train.getWalkNumLessEqualThenMaxStep_DynamicProgramming(startVertex, endVertex, maxLength, vertexSet, useWeight)

    a. use dynamic programming to write each count in an array

    b. if do not need to care each edge's length then each edge length =1

    c. if the result is about 
    "How many path can go to end Vertex and the path length must < n " then each edge's length = edges[j].getWeight()

    d. each round the solution = soulution + vertex's child in the (round-1) solution

version 1  Recursive version

```js
   let walkNumLessEqualThenMaxStep_Recursive = function(walkNum, childArray, endVertex, maxWalk) {
        pathNum = 0
        for (let i = 0; i < childArray.length; i++) {

            if (childArray[i].getName() == endVertex) {
                pathNum++
            } else if (walkNum < maxWalk) {
                pathNum = pathNum + walkNumLessEqualThenMaxStep(walkNum + 1, childArray[i].getchildVertexs(), endVertex, maxWalk)
            }
        }
        return pathNum;
    }
```

version 2 DynamicProgramming version
```js
    train.getWalkNumLessEqualThenMaxStep_DynamicProgramming = function(startVertex, endVertex, maxLength, vertexSet, useWeight) {
        var pathCounts = [];
        // let useWeight = false

        for (var walkLength = 0; walkLength <= maxLength; walkLength++) {
            pathCounts[walkLength] = {};

            for (let i = 0; i < Object.keys(vertexSet).length; i++) {
                // init
                let count = 0
                let name = Object.keys(vertexSet)[i]
                let edges = vertexSet[name].getEdges()

                for (let j = 0; j < edges.length; j++) {
                    let childName = edges[j].getNext().getName()
                    let edgeWeight
                    if (useWeight) {
                        edgeWeight = edges[j].getWeight()
                    } else {
                        edgeWeight = 1
                    }
                    if (walkLength >= edgeWeight) {
                        count = count + pathCounts[walkLength - edgeWeight][childName]
                    }
                }
                if (name == endVertex) {
                    count++
                }
                pathCounts[walkLength][name] = count

            }
        }
        if ((startVertex == endVertex)) {
            return pathCounts[maxLength][startVertex] - 1
        } else {
            return pathCounts[maxLength][startVertex]
        }

    }
```


3. train.getWalkNumEqualMaxStep_DynamicProgramming(startVertex, endVertex, maxLength, vertexSet)

a. it very like the soulution on "2." but need to limit the condition to counting 

version 1  Recursive version
```js
    let walkNumEqualStep_Recursive = function(walkNum, childArray, endVertex, maxWalk) {
        pathNum = 0
        for (let i = 0; i < childArray.length; i++) {

            if (walkNum == maxWalk && childArray[i].getName() == endVertex) {
                pathNum++
            } else if (walkNum < maxWalk) {
                pathNum = pathNum + walkNumEqualStep(walkNum + 1, childArray[i].getchildVertexs(), endVertex, maxWalk)
            }
        }
        return pathNum;
    }
```
version 2  Dynamic Programming version
```js
    train.getWalkNumEqualMaxStep_DynamicProgramming = function(startVertex, endVertex, maxLength, vertexSet) {
        var pathCounts = [];

        for (var walkLength = 0; walkLength <= maxLength; walkLength++) {
            pathCounts[walkLength] = {};

            for (let i = 0; i < Object.keys(vertexSet).length; i++) {
                // init
                let count = 0
                let name = Object.keys(vertexSet)[i]
                let edges = vertexSet[name].getEdges()

                for (let j = 0; j < edges.length; j++) {
                    let childName = edges[j].getNext().getName()
                    if (walkLength >= 1) {
                        count = count + pathCounts[walkLength - 1][childName]
                    }
                }
                // in here need to add condition in the first round
                if ((name == endVertex) && (walkLength == 0)) {
                    count++
                }
                pathCounts[walkLength][name] = count

            }
        }
        // console.log("pathCounts[]=" + JSON.stringify(pathCounts));
        if ((startVertex == endVertex) && (maxLength == 0)) {
            return pathCounts[maxLength][startVertex] - 1
        } else {
            return pathCounts[maxLength][startVertex]
        }

    }
```

4. train.getShortestLength = function(start, end)

a. it is a tractional shortest path problem , then using a Fibonacci Heap for implementing Dijkstra's Algorithm

b . the idea is 
    there are vertexes {v,u,s}  , and v is start s is end
    if destince(v,s)>destince(v,u)+destince(u,s)
    then the path v->s change to v->u->s

```js
    train.getShortestLength = function(start, end) {

        var verticesToCheck = new PriorityQueue();
        var hasBeenQueued = {};

        var processVertex = function(vertex, distance) {
            var edges = vertex.getEdges();
            for (var i = 0; i < edges.length; i++) {
                var newVert = edges[i].getNext();
                var newDist = distance + edges[i].getWeight();
                if (hasBeenQueued[newVert])
                    try {
                        verticesToCheck.decreaseKey(newVert, newDist);
                    } catch (e) {}
                else {
                    verticesToCheck.add(newDist, newVert);
                    hasBeenQueued[newVert] = true;
                }
            }
        }

        processVertex(start, 0);

        var queueElem;
        while ((queueElem = verticesToCheck.extractMin()) != null) {
            var distance = queueElem.key;
            var vertex = queueElem.value;
            if (vertex == end)
                return distance;
            else
                processVertex(vertex, distance);
        }
        return null;
    };
```