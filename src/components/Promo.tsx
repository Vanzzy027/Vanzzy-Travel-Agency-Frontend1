import React from 'react';

const Promo: React.FC = () => {
    return (
        <section className="py-16 bg-[#f8f3ef]">
            <div className="container mx-auto px-4">
                <div className="border-l-4 border-[#8b5e34] p-8 bg-[#f8f3ef] shadow-lg flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-[#5c3a21] mb-2">
                            Discover Our Seasonal Menu
                        </h3>
                        <p className="text-sm text-[#8a6f57]">
                            Experience the finest ingredients expertly crafted into a memorable dinner. Limited seats available nightly.
                        </p>
                    </div>
                    <button className="bg-[#8b5e34] text-[#f8f3ef] text-sm font-bold py-3 px-6 rounded-sm hover:bg-[#6e4828] transition-colors flex-shrink-0">
                        Book Your Table Now
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Promo;
