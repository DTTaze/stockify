from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, LayerNormalization, MultiHeadAttention, Dropout, GlobalAveragePooling1D

def build_transformer_model(input_shape):
    """Build a Time Series Transformer Encoder model in Keras"""
    inputs = Input(shape=input_shape)

    # Multi-head Self-Attention block
    attention_output = MultiHeadAttention(num_heads=4, key_dim=input_shape[1])(inputs, inputs)
    attention_output = Dropout(0.1)(attention_output)
    x = LayerNormalization(epsilon=1e-6)(inputs + attention_output)

    # Feed-Forward Network
    ffn_output = Dense(128, activation="relu")(x)
    ffn_output = Dense(input_shape[1])(ffn_output)
    ffn_output = Dropout(0.1)(ffn_output)
    x = LayerNormalization(epsilon=1e-6)(x + ffn_output)

    # Pooling & Output layers
    x = GlobalAveragePooling1D()(x)
    x = Dense(32, activation="relu")(x)
    outputs = Dense(1)(x)

    model = Model(inputs=inputs, outputs=outputs)
    model.compile(optimizer="adam", loss="mae")
    return model
