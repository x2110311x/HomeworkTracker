module.exports = function (admin, router) {
    router.get('/getCourseByName', (request, response) => {
        (async () => {
            if (request.signedin) {
                try {
                    var coursename = request.query.full_name;
                    var category = request.query.category;
                    return admin.firestore().collection('Courses').doc(category).collection('courses')
                    .where('full_name', '==', coursename).get()
                    .then((snapshot) => {
                        if(snapshot.empty){
                            return response.send('No matching documents');
                        } else {
                            return response.send(snapshot.docs[0].data());
                        }
                    });
                } catch (error) {
                    console.error("Error retrieving courses: ", error);
                    response.send(500).send("Error retrieving courses: ", error.message);
                }
            }
            else{
                response.status(403).send("Unauthorized");
            }
        })();
    });
}