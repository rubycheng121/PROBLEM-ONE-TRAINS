const fs = require('fs')
let PriorityQueue = typeof FibonacciHeap != "undefined" ? FibonacciHeap :
    require("./fibonacciHeap.js");

module.exports = function() {

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
            //A->B ;childEdge["B"] = A->B
            childEdge[nextVertex] = Edge;
            edges.push(Edge)
            childVertexs.push(nextVertex)
        };
    }
    Vertex.prototype.toString = function() {
        return "[" + this.getName() + "]";
    }
    var Edge = function(preVertex, nextVertex, weight) {
        this.getPre = function() { return preVertex; };
        this.getNext = function() { return nextVertex; };
        this.getWeight = function() { return weight; };
    }
    Edge.prototype.toString = function() {
        return "[" + this.getPre().getName() + "-> " + this.getNext().getName() + "]";
    }

    let train = {};
    let vertexSet = {};

    train.read = (path => {
        var data = fs.readFileSync(path);
        return (data.toString());
    })

    train.getGraphArray = (graphStr => {

        // replace \n
        graphStr = graphStr.replace(new RegExp("\\n", 'g'), "")

        // split string to an array : [<A,B,5],[<B,C,4],[<C,D,8],[<D,C,8],[<D,E,6],[<A,D,5],[<C,E,2],[<E,B,3],[<A,E,7],[]
        arr = graphStr.split(">")

        let newArray = []
        arr.forEach(element => {
                // replace "<" then the array is going to be : [A,B,5],[B,C,4],[C,D,8],[D,C,8],[D,E,6],[A,D,5],[C,E,2],[E,B,3][A,E,7],[]]
                element = element.replace("<", "")
                newArray.push(element)
            })
            // pop last empty array''
        newArray.pop()
        return newArray

    })

    train.buildGraph = (graphArray => {

        for (let i = 0; i < graphArray.length; i++) {
            // intputArray = ['A,B,5', 'B,C,4', 'C,D,8', 'D,C,8', 'D,E,6', 'A,D,5', 'C,E,2', 'E,B,3', 'A,E,7']
            let edgeStr = graphArray[i].split(",");

            //Parse A,B,5
            // v1 = A
            // v2 = B
            // weight = 5
            var v1 = edgeStr[0];
            var v2 = edgeStr[1];
            var weight = parseInt(edgeStr[2]);
            if (vertexSet[v1] == null) { vertexSet[v1] = new Vertex(v1); }
            if (vertexSet[v2] == null) { vertexSet[v2] = new Vertex(v2); }

            //Add edge
            let newEdge = new Edge(vertexSet[v1], vertexSet[v2], weight)
            vertexSet[v1].addEdge(newEdge, vertexSet[v2]);

        }
        return vertexSet
    })

    let getSingleWeight = function(from, to) {
        if (vertexSet[from].getchildEdges(vertexSet[to]) == undefined) {
            return 'NO SUCH ROUTE'
        } else {
            return vertexSet[from].getchildEdges(vertexSet[to]).getWeight()
        }
    }

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


    let walkNumLessEqualThenMaxStep_Recursive = function(walkNum, childArray, endVertex, maxWalk) {

        //tracing code
        // (1,[D,E],C,3)
        // P=0
        // D:
        // P=P+(2,[C,E],C,3)
        //      P=0
        //      C:  P=1
        //          P=P+(3,[D,E],C,3)
        //              D:P=0
        //              E:P=0
        //              P=0
        //          P=1
        //      E:  P=P+(3,[B],C)
        //              B:P=0
        //          P=1
        //      P=1
        // E:   P=1+(2,[B],C,3)
        //      P=0
        //      B:  P=0+(3,[C],C,3)
        //          P=0
        //          C: P=1
        //          P=1
        //      P=1
        // P=1+1=2
        pathNum = 0
        for (let i = 0; i < childArray.length; i++) {

            // debug use
            // console.log("walkNum= " + walkNum + " name= " + childArray[i].getName() + " maxWalk= " + maxWalk);
            // console.log("walkNum < maxWalk : " + (walkNum < maxWalk));

            //如果到C則有一條路徑存在,路徑應數量應該加1
            if (childArray[i].getName() == endVertex) {
                pathNum++
                //若未達最大步數,則路徑數量等於孩子到C的路徑步數,但少了1步的成本
            } else if (walkNum < maxWalk) {
                pathNum = pathNum + walkNumLessEqualThenMaxStep(walkNum + 1, childArray[i].getchildVertexs(), endVertex, maxWalk)
            }
        }
        return pathNum;
    }

    train.getWalkNumLessEqualThenMaxStep_Recursive = function(startVertex, endVertex, maxWalk) {
        let childArray = vertexSet[startVertex].getchildVertexs()

        return walkNumLessEqualThenMaxStep_Recursive(1, childArray, endVertex, maxWalk)

    }

    let walkNumEqualStep_Recursive = function(walkNum, childArray, endVertex, maxWalk) {
        // console.log(maxWalk);
        //tracing code
        // (1,[B,D,E],C,4)
        // P=0
        // B:
        // P=P+(2,[C],C,4)
        //      P=0
        //      C: P=P+(3,[D,E],C,4)=P+1=1
        //          P=0
        //          D:P+P(4,[C,E],C,4)
        //              P=0
        //              C:P=P+1=1
        //              E:P=P+0=1
        //              P=1
        //          E:P+P(4,[B],C,4)
        //              P=0
        //              B:P=1
        //              P=0
        //          P=1
        //      P=1
        // D:
        // P=0+(2,[C,E],C,4)
        //      P=0
        //      C:P=P+(3,[D,E],C,4)=P+1=1
        //          P=0
        //          D:P+P(4,[C,E],C,4)
        //              P=0
        //              C:P=P+1=1
        //              E:P=P+0=1
        //          P=1
        //      E:P=P+(3,[B],C,4)
        //          P=0
        //          B:P=P+(4,[C],C,4)
        //              P=0
        //              C:P=P+1=1
        //          P=1
        //      P=2
        // E:
        // P=1+(2,[B],C,3)
        //      P=0
        //      B:P=P+(3,[C],C,3)
        //          P=0
        //          C: P=P+(4,[D,E],C,4)
        //              D:P=0
        //              E:P=0
        //          P=0
        //      P=0
        // P=3

        // console.log("=======" + childArray + "-" + endVertex + "-" + walkNum + "-" + maxWalk);
        pathNum = 0
        for (let i = 0; i < childArray.length; i++) {

            //若步數相等 且抵達目的地 路徑數量應加1
            if (walkNum == maxWalk && childArray[i].getName() == endVertex) {
                pathNum++
                //若未達最大步數,則路徑數量等於孩子的路徑步數,但少了1步的成本
            } else if (walkNum < maxWalk) {
                // debug use
                // console.log("walkNum= " + walkNum + " name= " + childArray[i].getName());
                pathNum = pathNum + walkNumEqualStep(walkNum + 1, childArray[i].getchildVertexs(), endVertex, maxWalk)
            }
        }
        return pathNum;
    }

    train.getWalkNumEqualStep_Recursive = function(startVertex, endVertex, maxWalk) {
        let childArray = vertexSet[startVertex].getchildVertexs()
        return walkNumEqualStep_Recursive(1, childArray, endVertex, maxWalk);
    }

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

    train.getWalkNumLessEqualThenMaxStep_DynamicProgramming = function(startVertex, endVertex, maxLength, vertexSet, useWeight) {
        var pathCounts = [];
        // let useWeight = false

        for (var walkLength = 0; walkLength <= maxLength; walkLength++) {
            pathCounts[walkLength] = {};

            for (let i = 0; i < Object.keys(vertexSet).length; i++) {
                // name走walkLength步到endVertex的路徑初始化=0
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
        // console.log("pathCounts[]=" + JSON.stringify(pathCounts));
        if ((startVertex == endVertex)) {
            return pathCounts[maxLength][startVertex] - 1
        } else {
            return pathCounts[maxLength][startVertex]
        }

    }


    train.getWalkNumEqualMaxStep_DynamicProgramming = function(startVertex, endVertex, maxLength, vertexSet) {
        var pathCounts = [];

        for (var walkLength = 0; walkLength <= maxLength; walkLength++) {
            pathCounts[walkLength] = {};

            for (let i = 0; i < Object.keys(vertexSet).length; i++) {
                // name走walkLength步到endVertex的路徑初始化=0
                let count = 0
                let name = Object.keys(vertexSet)[i]
                let edges = vertexSet[name].getEdges()

                for (let j = 0; j < edges.length; j++) {
                    let childName = edges[j].getNext().getName()
                    if (walkLength >= 1) {
                        count = count + pathCounts[walkLength - edgeWeight][childName]
                    }
                }
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


    return train;
}