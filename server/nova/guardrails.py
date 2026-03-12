from nova_act import GuardrailDecision, GuardrailInputState

def autopass_guardrail(state: GuardrailInputState) -> GuardrailDecision:
    return GuardrailDecision.PASS