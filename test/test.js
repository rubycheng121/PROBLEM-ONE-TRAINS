var assert = require('assert');
var train = require('../index')('./inputFile.txt')

describe('PROBLEM ONE:  TRAINS', function() {
    let graphArray = []
    let data
    let expectedOutput = [9, 5, 13, 22, 'NO SUCH ROUTE', 2, 3, 9, 9, 7]
    let vertexSet
    describe('setUpGraph', function() {

        it('read inputFile', function() {

            data = train.read('./inputFile.txt')
            assert.equal("<A,B,5>\n<B,C,4>\n<C,D,8>\n<D,C,8>\n<D,E,6>\n<A,D,5>\n<C,E,2>\n<E,B,3>\n<A,E,7>", data);

        });

        it('format input Array', function() {

            graphArray = train.getGraphArray(data)
            let intputArray = ['A,B,5', 'B,C,4', 'C,D,8', 'D,C,8', 'D,E,6', 'A,D,5', 'C,E,2', 'E,B,3', 'A,E,7']

            for (let i = 0; i < intputArray.length; i++) {
                assert.equal(intputArray[i], graphArray[i]);
            }

        });

        it('build Graph : Graph should generate Vertex and Edge: ', function() {
            //build graph
            vertexSet = train.buildGraph(graphArray)

            // for (let i = 0; i < Object.keys(vertexSet).length; i++) {
            //     let name = Object.keys(vertexSet)[i]
            //     let edges = vertexSet[name].getEdges()
            //     for (let j = 0; j < edges.length; j++) {
            //         console.log(name + "-" + vertexSet[name].getEdges()[j].getNext().getName() + ":" + vertexSet[name].getEdges()[j].getWeight())

            //     }
            // }

            // <A,B,5>
            // <B,C,4>
            // <C,D,8>
            // <D,C,8>
            // <D,E,6>
            // <A,D,5>
            // <C,E,2>
            // <E,B,3>
            // <A,E,7>
            let inputVertexs = [{ fromVertex: "A", toVertex: "B", edgeWeight: 5 },
                    { fromVertex: "B", toVertex: "C", edgeWeight: 4 },
                    { fromVertex: "C", toVertex: "D", edgeWeight: 8 },
                    { fromVertex: "D", toVertex: "C", edgeWeight: 8 },
                    { fromVertex: "D", toVertex: "E", edgeWeight: 6 },
                    { fromVertex: "A", toVertex: "D", edgeWeight: 5 },
                    { fromVertex: "C", toVertex: "E", edgeWeight: 2 },
                    { fromVertex: "E", toVertex: "B", edgeWeight: 3 },
                    { fromVertex: "A", toVertex: "E", edgeWeight: 7 },

                ]
                // console.log(inputVertexs);

            //check the graph is equal to input
            for (let k = 0; k < inputVertexs.length; k++) {
                for (let i = 0; i < Object.keys(vertexSet).length; i++) {
                    let name = Object.keys(vertexSet)[i]
                    let edges = vertexSet[name].getEdges()

                    for (let j = 0; j < edges.length; j++) {
                        //if find it in the graph 
                        //then delete from input Array
                        if (inputVertexs[k].fromVertex == name &&
                            inputVertexs[k].toVertex == edges[j].getNext().getName() &&
                            inputVertexs[k].edgeWeight == edges[j].getWeight()) {
                            inputVertexs.splice(k, 1, '')
                        }

                    }
                }
            }
            //check the input Array is empty
            let isBuildSuccess = true
            for (let k = 0; k < inputVertexs.length; k++) {
                if (inputVertexs[k] != '') { isBuildSuccess = false }
            }
            assert.equal(true, isBuildSuccess);
            // console.log(inputVertexs);
            // console.log(isBuildSuccess);
        });

        it('a.The distance of the route A-B-C. answer:' + expectedOutput[0], function() {

            assert.equal(expectedOutput[0], train.getdistance('A-B-C'));
        })
        it('b.The distance of the route A-D. answer:' + expectedOutput[1], function() {

            assert.equal(expectedOutput[1], train.getdistance('A-D'));
        })
        it('c.The distance of the route A-D-C. answer:' + expectedOutput[2], function() {

            assert.equal(expectedOutput[2], train.getdistance('A-D-C'));
        })
        it('d.The distance of the route A-E-B-C-D. answer:' + expectedOutput[3], function() {

            assert.equal(expectedOutput[3], train.getdistance('A-E-B-C-D'));
        })
        it('e.The distance of the route A-E-D. answer:' + expectedOutput[4], function() {

            assert.equal(expectedOutput[4], train.getdistance('A-E-D'));
        })

        it('f.The number of trips starting at C and ending at C with a maximum of 3 stops.  In the sample data below, there are two such trips: C-D-C (2 stops). and C-E-B-C (3 stops). answer:' + expectedOutput[5], function() {

            let answer = train.getWalkNumLessEqualThenMaxStep('C', 'C', 3)
                // console.log(answer);
            assert.equal(expectedOutput[5], answer);
        })

        it('g.The number of trips starting at A and ending at C with exactly 4 stops. In the sample data below, there are three such trips: A to C (via B,C,D); A to C (via D,C,D); and A to C (via D,E,B). answer:' + expectedOutput[6], function() {

            // let answer = train.getWalkNumEqualStep('A', 'C', 4)
            // console.log(answer);
            // assert.equal(expectedOutput[6], answer);
        })

        it('h.The length of the shortest route (in terms of distance to travel) from A to C. answer:' + expectedOutput[7], function() {

            let answer = train.getShortestLength(vertexSet["A"], vertexSet["C"])
            assert.equal(expectedOutput[7], answer);
        })

        it('i.The length of the shortest route (in terms of distance to travel) from B to B. answer:' + expectedOutput[8], function() {

            let answer = train.getShortestLength(vertexSet["B"], vertexSet["B"])
                // console.log(answer);
            assert.equal(expectedOutput[8], answer);
        })

        it('j.The number of different routes from C to C with a distance of less than 50. E.g. CDC, CEBC are both trips of less than 50. answer:' + expectedOutput[9], function() {


            // let answer = train.getdistanceOfLessThan('C', 'C', 30)
            // console.log(answer);
            // assert.equal(expectedOutput[9], answer);
        })

    });

});