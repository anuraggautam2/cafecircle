'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Campaign } from '@/lib/types';
import {
  X,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  CreditCard,
  QrCode,
  FileText,
  Share2,
} from 'lucide-react';

interface InvestModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InvestModal({ campaign, isOpen, onClose, onSuccess }: InvestModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [amount, setAmount] = useState<number>(campaign.minInvestment || 10000);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI_SIMULATED' | 'CARD_SIMULATED'>('UPI_SIMULATED');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [investmentResult, setInvestmentResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const presets = [5000, 10000, 25000, 50000];

  const handleConfirmInvestment = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.id,
          userId: user?.id,
          amount,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setInvestmentResult(data);
        setStep(4);
        if (onSuccess) onSuccess();
      } else {
        alert(data.error || 'Failed to process simulated contribution');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const referralShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/cafes/${campaign.cafe?.slug || campaign.cafeId}?ref=${investmentResult?.referralCode || user?.referralCode}`
    : `https://cafecircle.com/cafes/${campaign.cafe?.slug}?ref=${user?.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-2xl shadow-2xl border border-white/90 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E2D6] flex items-center justify-between bg-[#FDFCFB]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#B84A22] font-semibold">
              {step === 4 ? 'Contribution Confirmed' : `Step ${step} of 3 • Simulated Agreement`}
            </div>
            <h3 className="font-serif font-bold text-lg text-[#181514]">
              {campaign.cafe?.name || 'Cafe Campaign'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7B746F] hover:bg-[#F3EFE7] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: Select Amount */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#7B746F] mb-2">
                  Select Contribution Amount (₹)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                        amount === preset
                          ? 'bg-[#181514] text-white border-[#181514]'
                          : 'bg-white text-[#181514] border-[#E2DCD2] hover:border-[#181514]'
                      }`}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#7B746F]">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    min={campaign.minInvestment}
                    max={campaign.maxInvestment}
                    step={1000}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-[#181514] font-mono text-sm focus:outline-none focus:border-[#181514]"
                  />
                </div>
                <div className="text-[11px] text-[#7B746F] mt-1.5 flex justify-between font-mono">
                  <span>Min: ₹{campaign.minInvestment.toLocaleString('en-IN')}</span>
                  <span>Max: ₹{campaign.maxInvestment.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Term structure review */}
              <div className="p-4 rounded-xl bg-[#F9F7F3] border border-[#E8E2D6] space-y-2 text-xs">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#7B746F]">Return Model:</span>
                  <span className="font-semibold text-[#181514]">{campaign.investmentStructure.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#7B746F]">Projected Yield:</span>
                  <span className="font-semibold text-[#2D6A4F]">{campaign.projectedReturnRate}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#7B746F]">Repayment Horizon:</span>
                  <span className="font-semibold text-[#181514]">{campaign.repaymentPeriod}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={amount < campaign.minInvestment}
                className="btn-primary w-full py-3 px-4 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 text-xs"
              >
                Review Digital Term Sheet & Disclosures
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STEP 2: Terms & Agreement */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FDFCFB] border border-[#E8E2D6] space-y-2 max-h-52 overflow-y-auto text-xs text-[#3D3835] leading-relaxed">
                <div className="font-bold text-sm text-[#181514] border-b pb-1">
                  Digital Term Sheet Summary
                </div>
                <p><strong>Issuing Cafe:</strong> {campaign.cafe?.name}</p>
                <p><strong>Repayment Structure:</strong> {campaign.returnTerms}</p>
                <p><strong>Disclosed Risk Factors:</strong> {campaign.riskFactors}</p>
                <p><strong>Regulatory Notice:</strong> Executed in educational sandbox mode to model community capital formation.</p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#262220]">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#D5CCBE] text-[#181514] focus:ring-[#181514]"
                />
                <span>
                  I have read and agree to the <strong>Simulated Investment Agreement</strong> and acknowledge the platform risk disclosures.
                </span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-lg font-semibold bg-[#F3EFE7] text-[#181514] hover:bg-[#E8E2D6] text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!termsAccepted}
                  className="btn-primary flex-1 py-2.5 px-4 flex items-center justify-center gap-2 text-xs disabled:opacity-50 shadow-sm"
                >
                  Confirm & Proceed
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Simulated Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center py-2 border-b border-[#F3EFE7] pb-4">
                <div className="text-[11px] font-mono uppercase text-[#7B746F]">Simulated Amount Due</div>
                <div className="text-3xl font-serif font-bold text-[#181514] mt-0.5 font-mono">
                  ₹{amount.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI_SIMULATED')}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-colors ${
                    paymentMethod === 'UPI_SIMULATED'
                      ? 'bg-[#F9F7F3] border-[#181514] text-[#181514]'
                      : 'bg-white border-[#E2DCD2] text-[#5A5450]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-[#B84A22]" />
                    <div>
                      <div className="text-xs font-bold text-[#181514]">Simulated UPI Flow</div>
                      <div className="text-[11px] text-[#7B746F]">Instant simulated authorization</div>
                    </div>
                  </div>
                  {paymentMethod === 'UPI_SIMULATED' && (
                    <CheckCircle2 className="w-4 h-4 text-[#181514]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD_SIMULATED')}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-colors ${
                    paymentMethod === 'CARD_SIMULATED'
                      ? 'bg-[#F9F7F3] border-[#181514] text-[#181514]'
                      : 'bg-white border-[#E2DCD2] text-[#5A5450]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#B84A22]" />
                    <div>
                      <div className="text-xs font-bold text-[#181514]">Corporate NetBanking / Card</div>
                      <div className="text-[11px] text-[#7B746F]">Standard gateway simulation</div>
                    </div>
                  </div>
                  {paymentMethod === 'CARD_SIMULATED' && (
                    <CheckCircle2 className="w-4 h-4 text-[#181514]" />
                  )}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 rounded-lg font-semibold bg-[#F3EFE7] text-[#181514] hover:bg-[#E8E2D6] text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmInvestment}
                  disabled={isSubmitting}
                  className="btn-primary flex-1 py-2.5 px-4 flex items-center justify-center gap-2 text-xs disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? 'Issuing Term Sheet...' : 'Execute Simulated Agreement'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Community Growth Engine */}
          {step === 4 && (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 bg-[#EDF5F1] text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-xl text-[#181514]">
                  Agreement Executed
                </h4>
                <p className="text-xs text-[#5A5450] mt-1">
                  You are now an official community backer for {campaign.cafe?.name}.
                </p>
              </div>

              {/* Certificate Summary */}
              <div className="p-4 rounded-xl bg-[#F9F7F3] border border-[#E8E2D6] text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#7B746F]">Certificate ID:</span>
                  <span className="font-bold text-[#181514]">
                    {investmentResult?.investment?.certificateNumber || 'CC-CERT-782190'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7B746F]">Amount:</span>
                  <span className="font-bold text-[#181514]">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7B746F]">Agreement Number:</span>
                  <span className="text-[#B84A22]">
                    {investmentResult?.agreement?.agreementNumber || 'CC-AGR-2026-94812'}
                  </span>
                </div>
              </div>

              {/* Referral Section */}
              <div className="p-4 rounded-xl bg-[#FDFCFB] border border-[#E8E2D6] text-left space-y-2.5">
                <div className="text-[11px] font-mono uppercase font-bold text-[#B84A22]">
                  Your Unique Cafe Referral Link
                </div>
                <p className="text-xs text-[#5A5450]">
                  Share with friends to track footfall and climb the community advocate leaderboard.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralShareUrl}
                    className="flex-1 text-xs py-2 px-3 rounded-lg border border-[#E2DCD2] bg-white text-[#181514] font-mono focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-primary w-full py-2.5 px-4 text-xs shadow-sm"
              >
                Go to Investor Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
