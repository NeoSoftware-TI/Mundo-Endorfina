"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export default function Page() {
    // Perfil
    const [name, setName] = useState<string>("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [bio, setBio] = useState<string>("");

    // Informações de Contato
    const [phone, setPhone] = useState<string>("");
    const [website, setWebsite] = useState<string>("");
    const [twitter, setTwitter] = useState<string>("");
    const [linkedin, setLinkedin] = useState<string>("");

    // Configurações Pessoais
    const [language, setLanguage] = useState<string>("en");
    const [preferences, setPreferences] = useState<{ darkMode: boolean; emailUpdates: boolean }>(
        { darkMode: false, emailUpdates: false }
    );
    const [notifications, setNotifications] = useState<boolean>(true);
    const [timezone, setTimezone] = useState<string>("UTC");
    const [dateFormat, setDateFormat] = useState<string>("DD/MM/YYYY");

    // Segurança e Privacidade
    const [twoFactor, setTwoFactor] = useState<boolean>(false);
    const [publicProfile, setPublicProfile] = useState<boolean>(true);

    // Handlers Perfil
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value);
    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) setPhoto(e.target.files[0]);
    };

    // Handlers Contato
    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value);
    const handleWebsiteChange = (e: ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value);
    const handleTwitterChange = (e: ChangeEvent<HTMLInputElement>) => setTwitter(e.target.value);
    const handleLinkedinChange = (e: ChangeEvent<HTMLInputElement>) => setLinkedin(e.target.value);

    // Handlers Configurações Pessoais
    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value);
    const handlePreferenceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setPreferences(prev => ({ ...prev, [name]: checked }));
    };
    const handleNotificationsChange = (e: ChangeEvent<HTMLInputElement>) => setNotifications(e.currentTarget.checked);
    const handleTimezoneChange = (e: ChangeEvent<HTMLSelectElement>) => setTimezone(e.target.value);
    const handleDateFormatChange = (e: ChangeEvent<HTMLSelectElement>) => setDateFormat(e.target.value);

    // Handlers Segurança e Privacidade
    const handleTwoFactorChange = (e: ChangeEvent<HTMLInputElement>) => setTwoFactor(e.currentTarget.checked);
    const handlePublicProfileChange = (e: ChangeEvent<HTMLInputElement>) => setPublicProfile(e.currentTarget.checked);

    // Submit
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const payload = {
            name, photo, bio,
            contact: { phone, website, twitter, linkedin },
            settings: { language, preferences, notifications, timezone, dateFormat },
            security: { twoFactor, publicProfile }
        };
        console.log(payload);
        // Enviar payload para o backend
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Seção Perfil */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Perfil</h2>
                    <div>
                        <label className="block font-medium mb-1">Nome</label>
                        <input type="text" value={name} onChange={handleNameChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Foto de Perfil</label>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} />
                        {photo && <img src={URL.createObjectURL(photo)} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-full" />}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Bio</label>
                        <textarea value={bio} onChange={handleBioChange} className="w-full border p-2 rounded" rows={4} />
                    </div>
                </section>

                {/* Seção Contato */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Informações de Contato</h2>
                    <div>
                        <label className="block font-medium mb-1">Telefone</label>
                        <input type="tel" value={phone} onChange={handlePhoneChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Website</label>
                        <input type="url" value={website} onChange={handleWebsiteChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">X</label>
                        <input type="url" value={twitter} onChange={handleTwitterChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">LinkedIn</label>
                        <input type="url" value={linkedin} onChange={handleLinkedinChange} className="w-full border p-2 rounded" />
                    </div>
                </section>

                {/* Seção Configurações Pessoais */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Configurações Pessoais</h2>

                    <div>
                        <label className="block font-medium mb-1">Fuso Horário</label>
                        <select value={timezone} onChange={handleTimezoneChange} className="w-full border p-2 rounded">
                            <option value="UTC">UTC</option>
                            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                            <option value="America/New_York">New York (GMT-5)</option>
                            {/* Adicione outros fusos conforme necessário */}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Formato de Data</label>
                        <select value={dateFormat} onChange={handleDateFormatChange} className="w-full border p-2 rounded">
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>
                </section>

                {/* Seção Segurança e Privacidade */}
                <section className="space-y-4">
                    <label className="flex items-center">
                        <input type="checkbox" checked={publicProfile} onChange={handlePublicProfileChange} className="mr-2" />
                        Perfil Público
                    </label>
                </section>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Salvar
                </button>
            </form>
        </div>
    );
}
