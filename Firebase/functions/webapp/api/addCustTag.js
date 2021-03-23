module.exports = function (admin, router) {
    router.post("/addCustTag", (request, response) => {
        if (request.signedin) {
            var full_name = request.body.full_name;
            var short_name = request.body.short_name;
            var color = request.body.color;
            var date_created = admin.firestore.Timestamp.now();

            const data = {
                full_name: full_name,
                short_name: short_name,
                color: color,
                date_created: date_created,
            };

            // Add a new tag
            const writeResult = admin.firestore().collection('Users')
                .doc(request.decodedClaims.uid).collection('tags').add(data)
                .then(() => {
                    response.status(200).send("Tag successfully added");
                    console.log("Tag has been added,", writeResult.id);
                }).catch((error) => {
                    console.error("Error writing document: ", error);
                    response.send(500).send("Error writing document: ", error.message);
                });
        } else {
            response.status(403).send("Unauthorized");
        }
    });
}