import React from 'react';

const BriefInfoPost = () => {
    return (
        <div className="min-h-screen mt-20 px-4 lg:px-20">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/51/65/a7/harihar-fort.jpg?w=1200&h=-1&s=1"
                    alt="Harihar Fort"
                />
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Trekking at Harihar Fort</h1>
                    <p className="text-gray-700 mb-4">
                        Harihar Fort, located in Maharashtra, India, is a popular trekking destination known for its unique rock-cut steps. The trek offers a challenging yet rewarding experience with stunning views from the top.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">How to Reach</h2>
                    <p className="text-gray-700 mb-4">
                        The base village for the Harihar Fort trek is Nirgudpada, which is well-connected by road. The nearest railway station is Kasara, from where you can hire a taxi or take a bus to Nirgudpada.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Accessories Needed</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>Sturdy trekking shoes</li>
                        <li>Backpack with water and snacks</li>
                        <li>Raincoat or poncho (during monsoon)</li>
                        <li>First-aid kit</li>
                        <li>Flashlight or headlamp</li>
                        <li>Trekking poles (optional)</li>
                        <li>Extra pair of socks</li>
                    </ul>
                    <h2 className="text-xl font-semibold mb-2">Where to Stay</h2>
                    <p className="text-gray-700 mb-4">
                        You can camp at the base village or stay in nearby towns like Igatpuri or Nashik which offer various accommodation options.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">What to Wear</h2>
                    <p className="text-gray-700 mb-4">
                        Wear comfortable trekking clothes, preferably quick-dry fabrics. Layer your clothing if trekking during colder months. Don't forget a hat and sunglasses.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Duration</h2>
                    <p className="text-gray-700 mb-4">
                        The trek to Harihar Fort typically takes about 3-4 hours to ascend and 2-3 hours to descend, depending on your fitness level and the weather conditions.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Best Time to Visit</h2>
                    <p className="text-gray-700 mb-4">
                        The best time to visit Harihar Fort is during the monsoon (June to September) and winter (October to February) seasons. The monsoon season offers lush greenery and flowing waterfalls, while winter provides clear skies and cool temperatures.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Difficulty Level</h2>
                    <p className="text-gray-700 mb-4">
                        The trek is considered moderate to difficult due to the steep and narrow rock-cut steps. It's suitable for trekkers with some prior experience.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Safety Tips</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>Always trek with a group or guide.</li>
                        <li>Carry enough water and stay hydrated.</li>
                        <li>Check the weather forecast before starting the trek.</li>
                        <li>Wear proper footwear to avoid slipping.</li>
                        <li>Avoid trekking during heavy rainfall.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BriefInfoPost;
