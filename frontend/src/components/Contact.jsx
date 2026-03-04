import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const BASE_SERVER_URL = import.meta.env.VITE_BASE_SERVER_URL;
const CATEGORY_API_URL = `${BASE_SERVER_URL}/api/products/get-categories`;
const PRODUCT_API_URL = `${BASE_SERVER_URL}/api/products/get-products`;

export default function Contact() {
    /* ===================== FORM STATE ===================== */
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        country_code: "",
        phone: "",
        message: "",
        categories: [],
        products: [],
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [productOpen, setProductOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [productSearch, setProductSearch] = useState("");


    /* ===================== FETCH CATEGORIES ===================== */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(CATEGORY_API_URL);
                const data = res.data.data;

                const parsed = (Array.isArray(data) ? data[0] : []).map((item, index) => ({
                    id: item.id ?? item._id ?? String(index),
                    label: item.category,
                }));

                parsed.sort((a, b) => a.label.localeCompare(b.label));
                setCategoryOptions(parsed);
            } catch (err) {
                console.error("Failed to fetch categories", err);
                setCategoryOptions([]);
            }
        };

        fetchCategories();
    }, []);
    

    /* ===================== FETCH PRODUCTS ===================== */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(PRODUCT_API_URL);
                const data = res.data.data;

                const parsed = (Array.isArray(data) ? data : []).map((item, index) => ({
                    id: item.id ?? item._id ?? String(index),
                    label: item.name ?? item.label ?? `Product ${index + 1}`,
                }));

                parsed.sort((a, b) => a.label.localeCompare(b.label));
                setProductOptions(parsed);
            } catch (err) {
                console.error("Failed to fetch products", err);
                setProductOptions([]);
            }
        };

        fetchProducts();
    }, []);

    /* ===================== HANDLERS ===================== */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleCategory = (id) => {
        setFormData((prev) => ({
            ...prev,
            categories: prev.categories.includes(id)
                ? prev.categories.filter((c) => c !== id)
                : [...prev.categories, id],
        }));
    };

    const toggleProduct = (id) => {
        setFormData((prev) => ({
            ...prev,
            products: prev.products.includes(id)
                ? prev.products.filter((p) => p !== id)
                : [...prev.products, id],
        }));
    };

    const toggleItem = (key, id) => {
        setFormData((prev) => {
            const exists = prev[key].includes(id);

            return {
                ...prev,
                [key]: exists
                    ? prev[key].filter((item) => item !== id)
                    : [...prev[key], id],
            };
        });
    };


    /* ===================== VALIDATION ===================== */
    const validate = () => {
        const e = {};
        if (!formData.name.trim()) e.name = "Name is required";
        if (!formData.email.match(/^\S+@\S+\.\S+$/))
            e.email = "Valid email is required";
        if (!formData.message.trim()) e.message = "Message is required";
        return e;
    };

    const getCategoryNames = () =>
        formData.categories.map((id) => {
            const found = categoryOptions.find((c) => c.id === id);
            return found?.label;
        }).filter(Boolean);

    const getProductNames = () =>
        formData.products.map((id) => {
            const found = productOptions.find((p) => p.id === id);
            return found?.label;
        }).filter(Boolean);


    /* ===================== SUBMIT ===================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading("Sending your message...");

        try {
            
            await axios.post(`${BASE_SERVER_URL}/api/contact/submit-enquiries`, {
                name: formData.name,
                company: formData.company || null,
                email: formData.email,
                country_code: formData.country_code || null,
                phone: formData.phone || null,
                message: formData.message,

                // ✅ Send names instead of IDs
                categories: getCategoryNames(),
                products: getProductNames(),
            });


            toast.success("Message sent successfully!", { id: loadingToast });

            setFormData({
                name: "",
                company: "",
                email: "",
                country_code: "",
                phone: "",
                message: "",
                categories: [],
                products: [],
            });
            setErrors({});
        } catch (err) {
            console.error(err);
            toast.error("Failed to send message. Please try again.", {
                id: loadingToast,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCategories = categoryOptions
        .filter(c =>
            c.label.toLowerCase().includes(categorySearch.toLowerCase())
        )
        .sort((a, b) => a.label.localeCompare(b.label));

    const filteredProducts = productOptions
        .filter(p =>
            p.label.toLowerCase().includes(productSearch.toLowerCase())
        )
        .sort((a, b) => a.label.localeCompare(b.label));

    const inputClass =
        "w-full rounded-lg border border-slate-300 px-4 py-3 text-sm " +
        "focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition";



    return (
        <>
            {/* 🔔 Toast container */}
            <Toaster position="top-right" reverseOrder={false} />

            <section className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-amber-100 py-20 px-6">
                <div className="max-w-6xl mx-auto space-y-16 text-gray-800">

                    {/* ================= HEADER ================= */}
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-4xl font-bold tracking-tight mb-4 unbounded-subHeading">
                            Get in Touch
                        </h1>
                        <p className="text-gray-600 sanchez-regular">
                            Reach out to our international representatives or send us a message.
                        </p>
                    </div>

                    {/* ================= TOP CONTACT CARDS ================= */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                name: "Indonesia",
                                email: "indobusinessexports@gmail.com",
                                phone: ["+62 82338 515405", "+62 85926 424213"],
                                color: "from-blue-700 to-blue-600",
                            },
                            {
                                name: "India",
                                email: "indobusinessexports@gmail.com",
                                phone: ["+91 73859 84164", "+91 85528 81888"],
                                color: "from-green-700 to-green-600",
                            },
                        ].map((person, i) => (
                            <div
                                key={i}
                                className={`relative  backdrop-blur-md rounded-3xl p-7 bg-gradient-to-r ${person.color}
                           shadow-lg hover:shadow-2xl
                           transition-all duration-300 hover:-translate-y-1 text-white`}
                            >
                                <h2 className="text-2xl font-semibold mb-4 sanchez-regular">
                                    {person.name}
                                </h2>

                                <div className="space-y-2">
                                    <p>
                                        📧{" "}
                                        <a
                                            href={`mailto:${person.email}`}
                                            className="hover:text-amber-600 transition unbounded-subHeading"
                                        >
                                            {person.email}
                                        </a>
                                    </p>
                                    {person.phone.map((phoneNumber, idx) => (
                                        <p key={idx}>
                                            📞{" "}
                                            <a
                                                href={`tel:${person.phone}`}
                                                className="hover:text-amber-600 transition unbounded-subHeading"
                                            >
                                                {phoneNumber}
                                            </a> 
                                            </p>))}
                                        </div>
                            </div>
                        ))}
                            </div>

                    {/* ================= BOTTOM GLASS CONTAINER ================= */ }
                            <div className="bg-gradient-to-r from-amber-100 via-amber-100 to-amber-100 backdrop-blur-lg rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">

                            {/* -------- MAP CARD -------- */}
                            <div className="relative rounded-3xl overflow-hidden shadow-lg group">
                                <div className="absolute top-4 left-4 z-10 bg-white/90
                                px-4 py-1 rounded-full text-sm font-semibold shadow">
                                    📍 Our Location
                                </div>

                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.828368087111!2d112.6839523!3d-7.2352166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fee47bdfb92d%3A0xd27513d0468fb79f!2sAngtropolis%20%40%20Margomulyo%2046!5e1!3m2!1sen!2sin!4v1766393575057!5m2!1sen!2sin"
                                    className="w-full h-full min-h-[380px] border-0
                             transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t
                                from-amber-900/20 to-transparent
                                opacity-0 group-hover:opacity-100 transition" />
                            </div>

                            {/* -------- CONTACT FORM -------- */}
                            <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 rounded-3xl border shadow-lg p-10">
                                <h2 className="text-2xl font-semibold mb-8 unbounded-subHeading text-amber-950">Get In Touch</h2>

                                <form onSubmit={handleSubmit} className="space-y-6">

                                    <input name="name" placeholder="Full Name *" value={formData.name}
                                        onChange={handleChange} className={inputClass} />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

                                    <input name="email" placeholder="Email *" value={formData.email}
                                        onChange={handleChange} className={inputClass} />

                                    {/* ================= CATEGORY DROPDOWN ================= */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setCategoryOpen(!categoryOpen)}
                                            className={`${inputClass} flex justify-between items-center`}
                                        >
                                            <span>
                                                {formData.categories.length
                                                    ? `${formData.categories.length} selected`
                                                    : "Select categories"}
                                            </span>
                                            <span
                                                className={`transition-transform duration-300 ${categoryOpen ? "rotate-180" : ""
                                                    }`}
                                            >
                                                ▾
                                            </span>
                                        </button>

                                        <div
                                            className={`
                    absolute z-30 mt-2 w-full origin-top
                    transform transition-all duration-200 ease-out
                    ${categoryOpen
                                                    ? "scale-100 opacity-100 translate-y-0"
                                                    : "scale-95 opacity-0 -translate-y-2 pointer-events-none"}
                  `}
                                        >
                                            <div className="bg-white rounded-xl border shadow-xl overflow-hidden">
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={categorySearch}
                                                    onChange={(e) => setCategorySearch(e.target.value)}
                                                    className="w-full px-4 py-2 border-b text-sm outline-none"
                                                />
                                                <div className="max-h-48 overflow-y-auto">
                                                    {filteredCategories.map(c => (
                                                        <button
                                                            key={c.id}
                                                            type="button"
                                                            onClick={() => toggleItem("categories", c.id)}
                                                            className="w-full px-4 py-2 text-sm text-left
                                     hover:bg-amber-50 flex justify-between"
                                                        >
                                                            {c.label}
                                                            {formData.categories.includes(c.id) && "✓"}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ================= PRODUCT DROPDOWN ================= */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setProductOpen(!productOpen)}
                                            className={`${inputClass} flex justify-between items-center`}
                                        >
                                            <span>
                                                {formData.products.length
                                                    ? `${formData.products.length} selected`
                                                    : "Select products"}
                                            </span>
                                            <span
                                                className={`transition-transform duration-300 ${productOpen ? "rotate-180" : ""
                                                    }`}
                                            >
                                                ▾
                                            </span>
                                        </button>

                                        <div
                                            className={`
                    absolute z-30 mt-2 w-full origin-top
                    transform transition-all duration-200 ease-out
                    ${productOpen
                                                    ? "scale-100 opacity-100 translate-y-0"
                                                    : "scale-95 opacity-0 -translate-y-2 pointer-events-none"}
                  `}
                                        >
                                            <div className="bg-white rounded-xl border shadow-xl overflow-hidden">
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={productSearch}
                                                    onChange={(e) => setProductSearch(e.target.value)}
                                                    className="w-full px-4 py-2 border-b text-sm outline-none"
                                                />
                                                <div className="max-h-48 overflow-y-auto">
                                                    {filteredProducts.map(p => (
                                                        <button
                                                            key={p.id}
                                                            type="button"
                                                            onClick={() => toggleItem("products", p.id)}
                                                            className="w-full px-4 py-2 text-sm text-left
                                     hover:bg-amber-50 flex justify-between"
                                                        >
                                                            {p.label}
                                                            {formData.products.includes(p.id) && "✓"}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <textarea
                                        name="message"
                                        rows="4"
                                        placeholder="Message *"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`${inputClass} bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100`}
                                    />

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-lg py-3 bg-slate-900 text-white
                           hover:bg-slate-800 transition unbounded-subHeading"
                                    >
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </section >
        </>
    );
}