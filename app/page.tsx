// app/page.tsx
'use client';

import { useState } from 'react';

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function Home() { const [userEmail, setUserEmail] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [companyName, setCompanyName] = useState('Mon Entreprise SAS');
  const [companyAddress, setCompanyNameAddress] = useState('123 rue de Paris, 75001 Paris');
  
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: 'Prestation ou service principal', quantity: 1, unitPrice: 500 }
  ]);

  const [validityDays, setValidityDays] = useState('30');
  const [paymentTerms, setPaymentTerms] = useState('30% à la commande, le solde à la livraison');
  const [isGenerated, setIsGenerated] = useState(false);

  // État pour l'Assistant IA
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Fonction de l'Assistant IA (Simulation intelligente)
  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) {
      alert("Veuillez décrire votre projet pour l'IA.");
      return;
    }

    if (!userEmail) {
      alert("Veuillez entrer votre e-mail pour générer votre devis gratuit.");
      return;
    }

    const usedEmail = localStorage.getItem('free_quote_email');
    if (usedEmail === userEmail) {
      alert("Vous avez déjà utilisé votre devis gratuit avec cet e-mail !");
      setIsBlocked(true);
      return;
    }  
    setIsAiLoading(true);

    setTimeout(() => {
      const text = aiPrompt.toLowerCase();
      let generatedDesc = aiPrompt;
      let estimatedPrice = 750;

      if (text.includes('site') || text.includes('web') || text.includes('internet')) {
        generatedDesc = `Création de site web sur-mesure : ${aiPrompt}`;
        estimatedPrice = 1200;
      } else if (text.includes('logo') || text.includes('design') || text.includes('charte')) {
        generatedDesc = `Conception graphique & identité visuelle : ${aiPrompt}`;
        estimatedPrice = 450;
      } else if (text.includes('conseil') || text.includes('audit') || text.includes('coaching')) {
        generatedDesc = `Mission de conseil et accompagnement : ${aiPrompt}`;
        estimatedPrice = 850;
      }

      setItems([
        { id: Date.now(), description: generatedDesc, quantity: 1, unitPrice: estimatedPrice }
      ]);

      setIsAiLoading(false);
      setAiPrompt('');
localStorage.setItem('free_quote_email', userEmail);
    }, 800);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: '', quantity: 1, unitPrice: 0 }
    ]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) {
      alert("Veuillez renseigner au moins le nom du client.");
      return;
    }
    setIsGenerated(true);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleSubscribe = () => {
    alert("Redirection vers la page de paiement sécurisée à 35€/mois...");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* En-tête / Offre SaaS */}
        <div className="text-center space-y-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-extrabold text-indigo-400">Générateur de Devis avec Assistant IA</h1>
          <p className="text-slate-400 text-sm">
            Propulsez votre productivité : décrivez votre prestation en français, l'IA rédige et chiffre le devis pour vous.
          </p>
          <div className="inline-block bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mt-2">
            Abonnement illimité Pro : 35 € / mois
          </div>
        </div>

        {/* 🤖 NOUVEAU : Bloc Assistant IA */}
        <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-lg font-bold text-indigo-300">Assistant IA de Rédaction</h2>
          </div>
          <p className="text-xs text-slate-400">
            Exemple : "Refonte complète d'une identité visuelle pour un restaurant bio" ou "Création d'une application mobile e-commerce"
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Décrivez votre prestation en quelques mots..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
         <input
        type="email"
        placeholder="Entrez votre e-mail pour votre devis gratuit"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none mb-3"
      />  
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isAiLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-md"
            >
              {isAiLoading ? "Génération..." : "Générer via l'IA ⚡"}
            </button>
          </div>
        </div>

        {/* Formulaire complet */}
        <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-2">1. Vos informations</h2>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nom de votre entreprise</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Adresse de l'entreprise</label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyNameAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-2">2. Informations du client</h2>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nom du client / Entreprise *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Entreprise Dupont"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email ou Adresse du client</label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Ex: contact@dupont.fr"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-lg font-semibold text-slate-200">3. Prestations (Rédigées ou IA)</h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                + Ajouter une ligne
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-3 items-center bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <div className="w-full md:w-3/5">
                    <input
                      type="text"
                      placeholder={`Description ${index + 1}`}
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                      placeholder="Qté"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 text-center"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                      placeholder="Prix unit. €"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 text-center"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Validité du devis (en jours)</label>
              <input
                type="text"
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Conditions de règlement</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors text-base shadow-lg shadow-emerald-950/50 mt-4"
          >
            Générer / Mettre à jour le Devis Officiel
          </button>
        </form>

        {/* Aperçu du Devis */}
        {isGenerated && (
          <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl space-y-6 print:shadow-none print:w-full">
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-2xl font-black text-indigo-900">{companyName}</h2>
                <p className="text-xs text-slate-500 mt-1">{companyAddress}</p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Devis</span>
                <p className="text-xs text-slate-500 mt-2">Ref : #DEV-2026-001</p>
                <p className="text-xs text-slate-500">Date : {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Facturé à :</p>
              <p className="font-bold text-slate-800">{clientName}</p>
              <p className="text-slate-600 text-xs">{clientAddress}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Qté</th>
                    <th className="py-2 text-right">P.U. HT</th>
                    <th className="py-2 text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-slate-800">{item.description || 'Prestation sans description'}</td>
                      <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-3 text-right text-slate-600">{item.unitPrice.toFixed(2)} €</td>
                      <td className="py-3 text-right font-medium text-slate-800">{(item.quantity * item.unitPrice).toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Total HT</span>
                  <span>{calculateTotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>TVA (20% indicatif)</span>
                  <span>{(calculateTotal() * 0.2).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-base font-bold text-indigo-900 border-t border-slate-200 pt-2">
                  <span>Total TTC</span>
                  <span>{(calculateTotal() * 1.2).toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 pt-4 border-t border-slate-100 space-y-1">
              <p><strong>Conditions de règlement :</strong> {paymentTerms}</p>
              <p><strong>Validité de l'offre :</strong> {validityDays} jours</p>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 print:hidden shadow-md"
            >
              📥 Enregistrer / Imprimer ce devis en PDF
            </button>
          </div>
        )}

        {/* Section abonnement SaaS */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4 print:hidden">
          <h3 className="font-bold text-lg text-slate-200">Passez à la vitesse supérieure</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Profitez de l'assistant IA illimité, de l'export PDF et de la gestion centralisée de vos clients pour 35 € / mois.
          </p>
          <button
            onClick={handleSubscribe}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-emerald-950/50"
          >
            S'abonner à l'offre Pro (35 € / mois)
          </button>
        </div>

      </div>
    </main>
  );
}
